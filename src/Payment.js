import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap-grid.min.css';
import './App.css';

const amount = 50000;
const currency = "INR";
const receipt = "receipt#1";

const as = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({ amount, currency, receipt }),
      headers: { "Content-Type": "application/json" },
    });
    
    const order = await response.json();
    console.log(order);
    
    const options = {
      key: "rzp_test_jGLgUjxUV4vXJu",
      amount,
      currency,
      name: "water purifiers",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: async function(response) {
        const body = { ...response };
        
        const validateRes = await fetch("http://localhost:5000/order/validate", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
      },
      prefill: {
        name: "aswin",
        email: "aswinvarma956@gmail.com",
        contact: "839388439934",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    
    rzp1.on("payment.failed", async function(response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
      console.log("failed");

      const failedPaymentBody = {
        order_id: 'failed',
        payment_id: 'failed',
        message: 'failed',
        status:0
      };

      const failedPaymentRes = await fetch("http://localhost:5000/order/validate", {
        method: "POST",
        body: JSON.stringify(failedPaymentBody),
        headers: { "Content-Type": "application/json" },
      });
      
      const failedJsonRes = await failedPaymentRes.json();
      console.log(failedJsonRes);
    });
    
    rzp1.open();
  } catch (error) {
    console.error("Error:", error);
  }
};

const Payment = () => {
  return (
    <div>
      <button onClick={as}>Make Payment</button>
    </div>
  );
};

export default Payment;
