
const express = require("express")
const app = express();

const cookieparser = require("cookie-parser")
const cors = require('cors');
const fileUpload = require("express-fileupload");

const Collection_of_all_Routes = require("../Backend/routes/routesCollection.routes");


const globalApiErrorHandler = require("./middlewares/globalApiErrorHandler");

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://study-notion-five-tau.vercel.app",
        "https://study-notion-git-main-manojmeena2990-gmailcoms-projects.vercel.app",
        "https://study-notion-manojmeena2990-gmailcoms-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));



app.use(cookieparser());

app.use(express.json());

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));


//custom globle middleware
app.use(globalApiErrorHandler);  


//router declearation
Collection_of_all_Routes(app);

app.get('/', (req, res) => {
    console.log('api call at /');
    res.send('server api call is wroking............'); 
});  




module.exports = app;