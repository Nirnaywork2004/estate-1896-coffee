/**
 * Razorpay Payment Service (Client-Side)
 * - Orchestrates official Razorpay Checkout SDK in Test Mode
 * - Interfaces with secure server-side endpoints for order creation and cryptographic signature verification
 */

export interface RazorpayOrderResponse {
  id: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

export interface RazorpayCheckoutParams {
  amount: number; // in INR (e.g. 378)
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  orderDescription?: string;
  receipt?: string;
  onSuccess: (payment: RazorpaySuccessResponse) => Promise<void> | void;
  onDismiss?: () => void;
  onError: (error: Error) => void;
}

/**
 * Mask Key ID for safe diagnostic logging (e.g. rzp_test_...w2Hn0I)
 */
function maskKeyId(key: string): string {
  if (!key || key.length < 12) return '****';
  return `${key.slice(0, 9)}...${key.slice(-6)}`;
}

class PaymentService {
  private scriptLoadingPromise: Promise<boolean> | null = null;

  /**
   * Dynamically loads the official Razorpay checkout script if not present
   */
  async loadRazorpayScript(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if ((window as any).Razorpay) return true;

    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;

    this.scriptLoadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('[Razorpay Client] Failed to load Razorpay Checkout script from CDN');
        resolve(false);
      };
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Request real order creation from our secure server endpoint
   */
  async createServerOrder(amount: number, receipt?: string): Promise<RazorpayOrderResponse> {
    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, receipt }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to create Razorpay payment order on server.');
    }

    return data;
  }

  /**
   * Request server-side HMAC SHA256 cryptographic payment signature verification
   */
  async verifyPayment(payload: RazorpaySuccessResponse): Promise<PaymentVerificationResponse> {
    const res = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.verified) {
      throw new Error(data.error || 'Payment signature verification failed on server.');
    }

    return data;
  }

  /**
   * Launch Razorpay Checkout Modal in Test Mode
   */
  async openCheckout(params: RazorpayCheckoutParams): Promise<void> {
    try {
      const isLoaded = await this.loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Unable to load Razorpay Checkout. Please check your network connection.');
      }

      // Step 1: Create real order on the server
      const serverOrder = await this.createServerOrder(params.amount, params.receipt);

      // Clean & format prefill fields
      const cleanedPhone = params.customerPhone ? params.customerPhone.replace(/\D/g, '').slice(-10) : '';
      const email = params.customerEmail && params.customerEmail.includes('@') ? params.customerEmail.trim() : undefined;
      const name = params.customerName ? params.customerName.trim() : 'Valued Customer';

      // Step 2: Configure clean Razorpay Checkout options (NO insecure HTTP image URLs to prevent Mixed Content / CORS blocks)
      const options: any = {
        key: serverOrder.keyId,
        amount: serverOrder.amount, // in paise
        currency: serverOrder.currency || 'INR',
        name: 'Estate 1896 Artisanal Coffee',
        description: params.orderDescription || 'Artisanal Coffee Order',
        order_id: serverOrder.id,
        prefill: {
          name,
          contact: cleanedPhone || undefined,
          email: email || undefined,
        },
        notes: {
          store: 'Estate 1896 Chikmagalur Roastery',
          orderReceipt: params.receipt || '',
        },
        theme: {
          color: '#382215', // Estate signature espresso theme
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            console.log('[Razorpay Client] Checkout modal dismissed by user');
            if (params.onDismiss) {
              params.onDismiss();
            }
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            console.log('[Razorpay Client] Checkout Success Callback:', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
            });

            // Step 3: Verify cryptographic signature on the server
            await this.verifyPayment(response);
            console.log('[Razorpay Client] Payment signature verified successfully on server');

            // Step 4: Finalize verified order in Supabase
            await params.onSuccess(response);
          } catch (err: any) {
            console.error('[Razorpay Client] Payment verification failed:', err);
            params.onError(err instanceof Error ? err : new Error('Payment verification failed.'));
          }
        },
      };

      // Diagnostic Logging
      console.log('[Razorpay Client] Checkout Initialized:', {
        masked_key_id: maskKeyId(serverOrder.keyId),
        order_id: serverOrder.id,
        amount_in_paise: serverOrder.amount,
        amount_in_inr: params.amount,
        currency: serverOrder.currency,
        prefill_name: name,
        prefill_contact: cleanedPhone ? `******${cleanedPhone.slice(-4)}` : 'none',
      });

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        console.error('[Razorpay Client] Checkout Payment Failed:', {
          code: response.error?.code,
          description: response.error?.description,
          source: response.error?.source,
          step: response.error?.step,
          reason: response.error?.reason,
        });
        params.onError(new Error(response.error?.description || 'Payment was unsuccessful.'));
      });

      rzp.open();
    } catch (err: any) {
      console.error('[Razorpay Client] Checkout error:', err);
      params.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

export const paymentService = new PaymentService();
