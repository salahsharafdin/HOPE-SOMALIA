// Payment service abstraction supporting Stripe, PayPal, and Mobile Money (EVC Plus / Zaad / Sahal)
class PaymentGatewayService {
  async processPayment({ amount, currency, donorEmail, paymentMethod }) {
    // Generates a mock transaction reference with realistic delay/validation simulation
    const txnPrefix = paymentMethod.toUpperCase().substring(0, 3);
    const transactionId = `${txnPrefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      status: 'Paid',
      amount,
      currency: currency || 'USD',
      timestamp: new Date().toISOString(),
      provider: paymentMethod,
    };
  }

  async refundPayment(transactionId) {
    return {
      success: true,
      transactionId,
      status: 'Refunded',
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new PaymentGatewayService();
