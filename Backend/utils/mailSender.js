
const nodemailer = require("nodemailer");
const {MAIL_HOST , MAIL_USER, MAIL_PASS} = require("../constant")

const mailsender = async( email, title,body) =>{
    try {
         let transporter = nodemailer.createTransport({
            host: `${MAIL_HOST}`,
            auth:{
                user: `${MAIL_USER}`,
                pass: `${MAIL_PASS}`,
            }
         })


         let info = await transporter.sendMail({
            from: 'studyNotion',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
         })

         return info
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = mailsender;