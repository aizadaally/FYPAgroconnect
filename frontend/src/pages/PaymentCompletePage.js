// // src/pages/PaymentCompletePage.js

// import React, { useState, useEffect } from 'react';
// import { Container, Card, Button, Spinner } from 'react-bootstrap';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ordersAPI, paymentsAPI } from '../services/api';

// function PaymentCompletePage() {
//   const { orderId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [verifying, setVerifying] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState(null);
  
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Extract payment ID from query string if present
//   const queryParams = new URLSearchParams(location.search);
//   const paymentId = queryParams.get('payment_id');
//   const paymentStatus = queryParams.get('status');
  
//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         setLoading(true);
//         setVerifying(true);
        
//         // Fetch order details
//         const orderResponse = await ordersAPI.getById(orderId);
//         const orderData = orderResponse.data;
//         setOrder(orderData);
        
//         // If order is already marked as paid, we're good
//         if (orderData.is_paid) {
//           setVerifying(false);
//           return;
//         }
        
//         // Find the transaction for this order
//         if (!orderData.transactions || orderData.transactions.length === 0) {
//           setError('No transaction found for this order');
//           setVerifying(false);
//           return;
//         }
        
//         // Get the most recent transaction
//         const transaction = orderData.transactions[orderData.transactions.length - 1];
        
//         // Verify payment status
//         const statusResponse = await paymentsAPI.checkMBankPaymentStatus(transaction.id);
        
//         if (!statusResponse.data.success) {
//           setError('Payment verification failed. Please contact support.');
//         }
        
//         // Re-fetch order to get updated paid status
//         const updatedOrderResponse = await ordersAPI.getById(orderId);
//         setOrder(updatedOrderResponse.data);
//       } catch (err) {
//         console.error('Error verifying payment:', err);
//         setError('An error occurred while verifying payment. Please contact support.');
//       } finally {
//         setLoading(false);
//         setVerifying(false);
//       }
//     };
    
//     verifyPayment();
//   }, [orderId, paymentId]);
  
//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="success" />
//         <p className="mt-3">Loading payment information...</p>
//       </Container>
//     );
//   }
  
//   if (verifying) {
//     return (
//       <Container className="py-5 text-center">
//         <Card>
//           <Card.Body className="p-5">
//             <h2 className="mb-4">Verifying Your Payment</h2>
//             <Spinner animation="border" variant="success" />
//             <p className="mt-4">Please wait while we verify your payment...</p>
//             <p className="text-muted">This may take a few moments.</p>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }
  
//   if (error || (order && !order.is_paid)) {
//     return (
//       <Container className="py-5">
//         <Card className="border-danger">
//           <Card.Header className="bg-danger text-white">
//             <h4 className="mb-0">Payment Verification Failed</h4>
//           </Card.Header>
//           <Card.Body className="p-4 text-center">
//             <div className="mb-4">
//               <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
//             </div>
//             <h5 className="mb-3">
//               {error || 'We could not confirm your payment was successful.'}
//             </h5>
//             <p className="mb-4">
//               If you believe this is an error or if the payment was deducted from your account,
//               please contact our support team with your order number and transaction details.
//             </p>
//             <div className="d-flex justify-content-center gap-3">
//               <Button 
//                 variant="outline-secondary" 
//                 onClick={() => navigate(`/orders/${orderId}`)}
//               >
//                 View Order Details
//               </Button>
//               <Button 
//                 variant="primary" 
//                 onClick={() => navigate(`/orders/${orderId}/payment`)}
//               >
//                 Try Payment Again
//               </Button>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }
  
//   return (
//     <Container className="py-5">
//       <Card className="border-success">
//         <Card.Header className="bg-success text-white">
//           <h4 className="mb-0">Payment Successful!</h4>
//         </Card.Header>
//         <Card.Body className="p-5 text-center">
//           <div className="mb-4">
//             <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
//           </div>
//           <h3 className="mb-3">Thank You for Your Order</h3>
//           <p className="mb-3">Your payment has been successfully processed.</p>
//           <p className="mb-4">
//             Order <strong>#{orderId}</strong> is now confirmed.
//           </p>
//           <div className="d-flex justify-content-center gap-3">
//             <Button 
//               variant="outline-secondary" 
//               onClick={() => navigate(`/orders/${orderId}`)}
//             >
//               View Order Details
//             </Button>
//             <Button 
//               variant="success" 
//               onClick={() => navigate('/')}
//             >
//               Continue Shopping
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// }

// export default PaymentCompletePage;