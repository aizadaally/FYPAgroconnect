// // src/pages/MBankPaymentPage.js

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ordersAPI, paymentsAPI } from '../services/api';

// function MBankPaymentPage() {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [transaction, setTransaction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initializing, setInitializing] = useState(false);
//   const [error, setError] = useState(null);
//   const [paymentUrl, setPaymentUrl] = useState('');
  
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Format currency
//   const formatCurrency = (value) => {
//     const numValue = parseFloat(value || 0);
//     return numValue.toFixed(2);
//   };
  
//   // Check if we're returning from MBank
//   const isReturningFromPayment = location.search.includes('payment_id');
  
//   // Initialize payment when component loads
//   useEffect(() => {
//     const fetchOrderAndInitPayment = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch order details
//         const orderResponse = await ordersAPI.getById(orderId);
//         const orderData = orderResponse.data;
//         setOrder(orderData);
        
//         // If order is already paid, redirect to confirmation
//         if (orderData.is_paid) {
//           navigate(`/orders/${orderId}/confirmation`);
//           return;
//         }
        
//         // If we're returning from payment, don't initialize a new payment
//         if (isReturningFromPayment) {
//           setLoading(false);
//           return;
//         }
        
//         // Initialize MBank payment
//         setInitializing(true);
//         const paymentResponse = await paymentsAPI.createMBankPayment(orderId);
        
//         if (paymentResponse.data.success) {
//           setPaymentUrl(paymentResponse.data.payment_url);
//           setTransaction({ id: paymentResponse.data.transaction_id });
//         } else {
//           setError('Failed to initialize payment. Please try again.');
//         }
//       } catch (err) {
//         console.error('Error:', err);
//         setError('Failed to load order or initialize payment');
//       } finally {
//         setLoading(false);
//         setInitializing(false);
//       }
//     };
    
//     fetchOrderAndInitPayment();
//   }, [orderId, navigate, isReturningFromPayment]);
  
//   // If returning from payment, check status
//   useEffect(() => {
//     if (isReturningFromPayment && transaction) {
//       const checkPaymentStatus = async () => {
//         try {
//           const statusResponse = await paymentsAPI.checkMBankPaymentStatus(transaction.id);
          
//           if (statusResponse.data.success && statusResponse.data.is_paid) {
//             // Payment was successful
//             navigate(`/orders/${orderId}/confirmation`);
//           }
//         } catch (err) {
//           console.error('Error checking payment status:', err);
//         }
//       };
      
//       checkPaymentStatus();
//     }
//   }, [isReturningFromPayment, transaction, orderId, navigate]);
  
//   const handleProceedToPayment = () => {
//     // Redirect to MBank payment page
//     window.location.href = paymentUrl;
//   };
  
//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="success" />
//         <p className="mt-3">Loading payment information...</p>
//       </Container>
//     );
//   }
  
//   if (error) {
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">{error}</Alert>
//         <div className="text-center mt-4">
//           <Button variant="outline-secondary" onClick={() => navigate(`/orders/${orderId}`)}>
//             Return to Order
//           </Button>
//         </div>
//       </Container>
//     );
//   }
  
//   if (isReturningFromPayment) {
//     return (
//       <Container className="py-5 text-center">
//         <Card>
//           <Card.Body className="p-5">
//             <h2 className="mb-4">Verifying Your Payment</h2>
//             <Spinner animation="border" variant="success" />
//             <p className="mt-4">Please wait while we verify your payment with MBank...</p>
//             <p className="text-muted">This may take a few moments.</p>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }
  
//   return (
//     <Container className="py-4">
//       <h1 className="mb-4">Complete Your Payment</h1>
      
//       <Row>
//         <Col lg={8}>
//           <Card className="mb-4">
//             <Card.Header className="bg-success text-white">
//               <h5 className="mb-0">MBank Payment</h5>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <div className="text-center mb-4">
//                 <img 
//                   src="/mbank-logo.png" 
//                   alt="MBank Logo" 
//                   style={{ height: '60px' }}
//                   onError={(e) => {e.target.src = 'https://via.placeholder.com/180x60?text=MBank'}}
//                 />
//               </div>
              
//               <p className="mb-4">
//                 You will be redirected to MBank's secure payment page to complete your payment.
//               </p>
              
//               <div className="mb-4">
//                 <p><strong>Order Amount:</strong> {formatCurrency(order?.total_amount)} KGS</p>
//                 <p><strong>Order ID:</strong> #{orderId}</p>
//               </div>
              
//               <div className="d-grid">
//                 <Button 
//                   variant="success" 
//                   size="lg" 
//                   onClick={handleProceedToPayment}
//                   disabled={initializing || !paymentUrl}
//                 >
//                   {initializing ? (
//                     <>
//                       <Spinner 
//                         as="span" 
//                         animation="border" 
//                         size="sm" 
//                         role="status" 
//                         aria-hidden="true" 
//                         className="me-2"
//                       />
//                       Preparing Payment...
//                     </>
//                   ) : (
//                     'Proceed to MBank Payment'
//                   )}
//                 </Button>
//               </div>
              
//               <div className="text-center mt-4">
//                 <p className="text-muted small">
//                   Your payment is secure and processed by MBank.
//                 </p>
//               </div>
//             </Card.Body>
//           </Card>
          
//           <div className="text-center">
//             <Button 
//               variant="outline-secondary" 
//               onClick={() => navigate(`/orders/${orderId}`)}
//             >
//               Cancel and Return to Order
//             </Button>
//           </div>
//         </Col>
        
//         <Col lg={4}>
//           <Card>
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">Order Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <p className="mb-3">Order #{orderId}</p>
              
//               {order?.items?.map(item => (
//                 <div key={item.id} className="mb-3 pb-3 border-bottom">
//                   <p className="mb-1 fw-semibold">{item.product_name}</p>
//                   <div className="d-flex justify-content-between text-muted small">
//                     <span>{item.quantity} × {formatCurrency(item.product_price)} KGS</span>
//                     <span>{formatCurrency(item.quantity * item.product_price)} KGS</span>
//                   </div>
//                 </div>
//               ))}
              
//               <div className="d-flex justify-content-between mt-4">
//                 <strong>Total:</strong>
//                 <strong>{formatCurrency(order?.total_amount)} KGS</strong>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default MBankPaymentPage;