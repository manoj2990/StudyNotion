
const{RAZORPAY_KEY, RAZORPAY_SECRET} = require("../constant")

const Razorpay = require("razorpay");



//createInstance of Razorpay
exports.instance = new Razorpay({
    key_id: RAZORPAY_KEY,
    key_secret: RAZORPAY_SECRET
});