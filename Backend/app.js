
const express = require("express")
const app = express();

const cookieparser = require("cookie-parser")
const cors = require('cors');
const fileUpload = require("express-fileupload");

const Collection_of_all_Routes = require("../Backend/routes/routesCollection.routes");
const { CORS_ORIGIN } = require("../Backend/constant");

const globalApiErrorHandler = require("./middlewares/globalApiErrorHandler");


//middlewares
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
})); 
// app.use(cors({
//     origin: ['http://localhost:3000'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   })); 
app.use(cookieparser());

app.use(express.json());

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));


//custom globle middleware
app.use(globalApiErrorHandler);  


//router declearation
Collection_of_all_Routes(app);
app.get('/api/v1/res', (req, res) => {
    console.log('Hello, World!');
    res.send('Hello, World*************!'); 
});  

app.get('/', (req, res) => {
    console.log('Hello, World!');
    res.send('server api call is wroking............'); 
});  




module.exports = app;