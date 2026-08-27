/**
 * Vercel Serverless Function: Create Razorpay Order
 * Endpoint: POST /api/razorpay/create-order
 * 
 * Secure server-side execution:
 * 1. Accurately converts amount to paise (1 INR = 100 paise).
 * 2. Authenticates with Razorpay API using Basic Auth with RAZORPAY_KEY_SECRET.
 * 3. Never exposes RAZORPAY_KEY_SECRET to the client bundle.
 */

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { amount, currency = 'INR', receipt } = body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid order amount.' });
    }

    if (!keyId || !keySecret) {
      console.error('[Vercel API /create-order] Missing Razorpay credentials in environment.');
      return res.status(500).json({
        error: 'Razorpay credentials are not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      });
    }

    // Convert amount to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    // Call official Razorpay Orders API
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
      console.error('[Vercel API /create-order] Razorpay API Error:', rzpData);
      return res.status(rzpResponse.status).json({
        error: rzpData.error?.description || rzpData.error?.reason || 'Razorpay order creation failed.',
      });
    }

    // Return order details and public Key ID for client checkout initialization
    return res.status(200).json({
      id: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      keyId,
    });
  } catch (err: any) {
    console.error('[Vercel API /create-order] Exception:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error while creating Razorpay order.',
    });
  }
}
