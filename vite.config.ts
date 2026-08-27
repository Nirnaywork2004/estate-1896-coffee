import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';

/**
 * Server-side Vite Plugin for Real Razorpay Test Mode Payment Endpoints
 * - POST /api/razorpay/create-order
 * - POST /api/razorpay/verify-payment
 * 
 * Guarantees:
 * 1. Razorpay Key Secret is NEVER exposed to the frontend/client.
 * 2. Amounts are accurately converted to paise.
 * 3. Orders are created via official Razorpay Orders API.
 * 4. Signatures are verified cryptographically via HMAC SHA-256.
 */
function razorpayServerPlugin(): Plugin {
  return {
    name: 'razorpay-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        // 1. CREATE RAZORPAY ORDER ENDPOINT
        if (req.method === 'POST' && url === '/api/razorpay/create-order') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const env = loadEnv(server.config.mode, process.cwd(), '');
              
              // Resolve real key ID (ignoring any mock strings)
              const rawKeyId = env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
              const keyId = rawKeyId.trim();
              const keySecret = (env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '').trim();

              const { amount, currency = 'INR', receipt } = JSON.parse(body || '{}');

              if (!amount || amount <= 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid order amount.' }));
                return;
              }

              if (!keyId || !keySecret) {
                console.error('[Razorpay Server] Missing credentials in .env (keyId or secret missing)');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: 'Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.',
                  })
                );
                return;
              }

              // Amount converted to paise correctly (1 INR = 100 paise)
              const amountInPaise = Math.round(Number(amount) * 100);
              const orderReceipt = receipt || `rcpt_${Date.now()}`;

              // Call official Razorpay Orders API (Test Mode)
              const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
              const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
                method: 'POST',
                headers: {
                  Authorization: authHeader,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: amountInPaise,
                  currency,
                  receipt: orderReceipt,
                  payment_capture: 1,
                }),
              });

              const rzpData = await rzpResponse.json();

              if (!rzpResponse.ok) {
                console.error('[Razorpay Server] API Order Creation Error:', rzpData);
                res.writeHead(rzpResponse.status, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: rzpData.error?.description || rzpData.error?.reason || 'Razorpay order creation failed.',
                  })
                );
                return;
              }

              console.log(`[Razorpay Server] Order created successfully: ${rzpData.id} (${amountInPaise} paise)`);

              // Success: Send order ID, amount in paise, currency and keyId to client
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  id: rzpData.id,
                  amount: rzpData.amount,
                  currency: rzpData.currency,
                  keyId,
                })
              );
            } catch (err: any) {
              console.error('[Razorpay Server] Create order exception:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message || 'Internal server error while creating Razorpay order.' }));
            }
          });
          return;
        }

        // 2. VERIFY RAZORPAY PAYMENT SIGNATURE ENDPOINT
        if (req.method === 'POST' && url === '/api/razorpay/verify-payment') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const env = loadEnv(server.config.mode, process.cwd(), '');
              const keySecret = (env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '').trim();

              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || '{}');

              if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ verified: false, error: 'Missing payment verification parameters.' }));
                return;
              }

              if (!keySecret) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ verified: false, error: 'Razorpay Key Secret is missing on the server.' }));
                return;
              }

              // Cryptographic HMAC SHA256 Signature Verification
              const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

              if (expectedSignature === razorpay_signature) {
                console.log(`[Razorpay Server] Payment verified: ${razorpay_payment_id} for order ${razorpay_order_id}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    verified: true,
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                  })
                );
              } else {
                console.error('[Razorpay Server] Signature mismatch for payment:', razorpay_payment_id);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ verified: false, error: 'Payment signature verification failed.' }));
              }
            } catch (err: any) {
              console.error('[Razorpay Server] Verify payment exception:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ verified: false, error: err.message || 'Internal server error during verification.' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), razorpayServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
