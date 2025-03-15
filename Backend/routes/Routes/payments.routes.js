

const express = require("express")
const router = express.Router()

//payment controller import
const {
    capturePayment, 
    verifyPayment ,
    sendPaymentSuccessEmail
    } = require("../../controllers/payments.controller")


// Importing Middlewares
const { auth, isStudent} = require("../../middlewares/auth.middleware")


router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", auth, isStudent,verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent,sendPaymentSuccessEmail)

module.exports = router