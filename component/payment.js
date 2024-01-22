// pages/payment.js
import { useState } from 'react';
import Razorpay from 'razorpay';

const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async () => {
    const razorpay = new Razorpay({
      key_id: 'rzp_test_3mMUh8mB7z2NLT',
      key_secret: 'Mg3q6IxawwHOuwzRwbes9lEV',
    });

    const options = {
      amount: 1000, // amount in the smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: 1,
    };

    razorpay.createOrder(options, (response) => {
      const orderId = response.id;

      razorpay.open({
        key: 'rzp_test_3mMUh8mB7z2NLT',
        amount: options.amount,
        currency: options.currency,
        name: 'Sourav',
        description: 'Buy Apple',
        order_id: orderId,
        handler: function (response) {
          setPaymentStatus('Payment successful!');
          console.log(response);
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999',
        },
      });
    });
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={handlePayment}>Make Payment</button>
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default PaymentPage;
