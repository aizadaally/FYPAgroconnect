# # api/payment_service.py

# import requests
# import json
# import hashlib
# import time
# from django.conf import settings
# import logging

# logger = logging.getLogger(__name__)

# class MBankPaymentService:
#     BASE_URL = "https://api.mbank.kg/payment/v1"  # Replace with actual MBank API URL
    
#     def __init__(self):
#         self.merchant_id = settings.MBANK_MERCHANT_ID
#         self.secret_key = settings.MBANK_SECRET_KEY
    
#     def _generate_signature(self, data):
#         """Generate signature for MBank API request"""
#         # Example signature generation - adjust based on MBank docs
#         ordered_data = dict(sorted(data.items()))
        
#         signature_string = ""
#         for key, value in ordered_data.items():
#             if key != "signature" and value is not None:
#                 signature_string += str(key) + "=" + str(value) + ";"
        
#         signature_string += self.secret_key
        
#         # Create SHA-256 hash
#         return hashlib.sha256(signature_string.encode('utf-8')).hexdigest()
    
#     def create_payment(self, order_id, amount, return_url, description=None):
#         """Create a payment request to MBank"""
#         try:
#             # Prepare payment data
#             payment_data = {
#                 "merchant_id": self.merchant_id,
#                 "amount": amount,
#                 "currency": "KGS",  # Kyrgyzstani Som
#                 "description": description or f"Payment for Order #{order_id}",
#                 "order_id": str(order_id),
#                 "timestamp": int(time.time()),
#                 "return_url": return_url,
#                 "callback_url": f"{settings.BACKEND_URL}/api/payments/mbank-callback/"
#             }
            
#             # Add signature
#             payment_data["signature"] = self._generate_signature(payment_data)
            
#             # Send request to MBank
#             response = requests.post(
#                 f"{self.BASE_URL}/create",
#                 json=payment_data,
#                 headers={"Content-Type": "application/json"}
#             )
            
#             # Process response
#             if response.status_code == 200:
#                 result = response.json()
                
#                 if result.get("status") == "success":
#                     return {
#                         "success": True,
#                         "payment_id": result.get("payment_id"),
#                         "payment_url": result.get("payment_url"),
#                         "reference": result.get("reference")
#                     }
#                 else:
#                     logger.error(f"MBank payment creation failed: {result.get('message')}")
#                     return {
#                         "success": False,
#                         "error": result.get("message", "Payment creation failed")
#                     }
#             else:
#                 logger.error(f"MBank API error: Status {response.status_code}")
#                 return {
#                     "success": False,
#                     "error": f"Payment gateway error: {response.status_code}"
#                 }
                
#         except Exception as e:
#             logger.exception("Error creating MBank payment")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }
    
#     def verify_payment(self, payment_id):
#         """Verify payment status with MBank"""
#         try:
#             # Prepare verification data
#             verify_data = {
#                 "merchant_id": self.merchant_id,
#                 "payment_id": payment_id,
#                 "timestamp": int(time.time())
#             }
            
#             # Add signature
#             verify_data["signature"] = self._generate_signature(verify_data)
            
#             # Send verification request
#             response = requests.post(
#                 f"{self.BASE_URL}/status",
#                 json=verify_data,
#                 headers={"Content-Type": "application/json"}
#             )
            
#             # Process response
#             if response.status_code == 200:
#                 result = response.json()
                
#                 if result.get("status") == "success":
#                     payment_status = result.get("payment_status")
                    
#                     return {
#                         "success": True,
#                         "payment_status": payment_status,
#                         "is_paid": payment_status == "PAID",
#                         "details": result
#                     }
#                 else:
#                     logger.error(f"MBank payment verification failed: {result.get('message')}")
#                     return {
#                         "success": False,
#                         "error": result.get("message", "Payment verification failed")
#                     }
#             else:
#                 logger.error(f"MBank API verification error: Status {response.status_code}")
#                 return {
#                     "success": False,
#                     "error": f"Payment gateway error: {response.status_code}"
#                 }
                
#         except Exception as e:
#             logger.exception("Error verifying MBank payment")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }