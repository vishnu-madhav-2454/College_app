import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const createFeePaymentSession = async ({
  amount,
  provider = 'demo',
  studentName = 'Student',
  email = 'student@example.com',
  receiptNo = 'DEMO-RECEIPT',
  metadata = {},
}) => {
  const numericAmount = Number(amount || 0);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Payment amount must be a valid positive number.');
  }

  if (provider === 'stripe') {
    if (!stripe) {
      return {
        provider: 'demo',
        mode: 'demo',
        status: 'Paid',
        amount: numericAmount,
        currency: 'inr',
        checkoutUrl: `https://demo-checkout.local/stripe?amount=${numericAmount}&student=${encodeURIComponent(studentName)}`,
        message: 'Stripe keys are not configured yet. Demo checkout enabled until live keys are added.'
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Apex Academy Fee Payment - ${receiptNo}`,
          },
          unit_amount: Math.round(numericAmount * 100),
        },
        quantity: 1,
      }],
      success_url: `${process.env.APP_BASE_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL || 'http://localhost:5173'}/payment-cancelled`,
      customer_email: email,
      metadata: {
        receiptNo,
        ...metadata,
      },
    });

    return {
      provider: 'stripe',
      amount: numericAmount,
      currency: 'INR',
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  if (provider === 'razorpay') {
    if (!razorpay) {
      return {
        provider: 'demo',
        mode: 'demo',
        status: 'Paid',
        amount: numericAmount,
        currency: 'INR',
        checkoutUrl: `https://demo-checkout.local/razorpay?amount=${numericAmount}&student=${encodeURIComponent(studentName)}`,
        message: 'Razorpay keys are not configured yet. Demo checkout enabled until live keys are added.'
      };
    }

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: 'INR',
      receipt: receiptNo,
      notes: {
        studentName,
        ...metadata,
      },
    });

    return {
      provider: 'razorpay',
      amount: numericAmount,
      currency: 'INR',
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amountInPaise: order.amount,
    };
  }

  return {
    provider: 'demo',
    mode: 'demo',
    status: 'Paid',
    amount: numericAmount,
    currency: 'INR',
    checkoutUrl: `https://demo-checkout.local/fee?amount=${numericAmount}&student=${encodeURIComponent(studentName)}`,
    message: 'Live payment provider is not configured. Demo mode is active; connect Stripe or Razorpay to use real transactions.'
  };
};

export const verifyRazorpayPayment = ({ orderId, paymentId, signature }) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret key is not configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const receivedSignature = Buffer.from(signature || '');
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  return receivedSignature.length === expectedSignatureBuffer.length
    && crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignature);
};

export const getRazorpayOrderStatus = async (orderId) => {
  if (!razorpay) {
    throw new Error('Razorpay is not configured.');
  }

  const order = await razorpay.orders.fetch(orderId);
  return order.status;
};
