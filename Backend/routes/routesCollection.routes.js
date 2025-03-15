
const courseRoute = require("../routes/Routes/course.routes");
const paymetsRoute = require("../routes/Routes/payments.routes");
const profileRoute = require("../routes/Routes/profile.routes");
const userRoutes = require("../routes/Routes/user.routes")


//mount the ROUTES to api and export to app.js
module.exports = (app)=>{
 app.use("/api/v1/course", courseRoute),
 app.use("/api/v1/payment", paymetsRoute),  
 app.use("/api/v1/profile", profileRoute),    
 app.use("/api/v1/auth", userRoutes)     
};
