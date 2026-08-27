/**
 * Vercel Serverless Function: Verify Razorpay Payment Signature
 * Endpoint: POST /api/razorpay/verify-payment
 * 
 * Cryptographically verifies that the payment was processed by Razorpay
 * using HMAC SHA-256 signature verification.
 */
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keySecret) {
      console.error('[Vercel API /verify-payment] Missing RAZORPAY_KEY_SECRET in environment.');
      return res.status(500).json({
        verified: false,
        error: 'Razorpay Key Secret is not configured on the server.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required payment verification parameters (order_id, payment_id, signature).',
      });
    }

    // Compute expected HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log(`[Vercel API /verify-payment] Payment verified: ${razorpay_payment_id} for order ${razorpay_order_id}`);
      return res.status(200).json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.error('[Vercel API /verify-payment] Signature mismatch for payment:', razorpay_payment_id);
      return res.status(400).json({
        verified: false,
        error: 'Payment signature verification failed.',
      });
    }
  } catch (err: any) {
    console.error('[Vercel API /verify-payment] Exception:', err);
    return res.status(500).json({
      verified: false,
      error: err.message || 'Internal server error during signature verification.',
    });
  }
}
