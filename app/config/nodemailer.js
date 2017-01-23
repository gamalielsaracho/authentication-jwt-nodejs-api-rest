import nodemailer from 'nodemailer'
import config from './config'

import crypto from 'crypto'

let smtpTransport = nodemailer.createTransport("SMTP", {
    service:'Gmail',
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
})

export default {
    sentMailVerificationLink: (user, token) => {
        let textLink = `http://${config.server.host}:${config.server.port}/${config.email.verifyEmailUrl}/${token}`
        let from = `${config.email.accountName} Team< ${config.email.username} >`
        
        let mailbody = `
            <p> Thanks for Registering on ${config.email.accountName} </p>
            <p>Please verify your email by clicking on the verification link below.</p><br/>
            <a href='${textLink.toString()}'>Verification Link</a>
        `
        mail(from, user.email, 'Account Verification', mailbody)
    },
    sentMailForgotPassword: (user) => {
        let textLink = 'http://${config.server.host}/reset-password/${user.resetPasswordToken}'
        let from = `${config.email.accountName} Team< ${config.email.username} >`
        
        let mailbody = `
            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p></br>
            Please click on the following link, or paste this into your browser to complete the process:</p></br>
            <a href='${textLink.toString()}'>Verification Link</a></br>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
        mail(from, user.email, 'Reset Password', mailbody)
    },
    sentMailPasswordChanged: (user) => {
        let from = `${config.email.accountName} Team< ${config.email.username} >`

        let mailbody = `
            <p>You are receiving this email because you changed your password.</p>
            <p>If you did not request this change, please contact us immediately.</p>
        `
        mail(from, user.email, 'Password Changed', mailbody)
    }
}

function mail(from , email, subject, mailbody) {
	let mailOptions = {
        from: from, // Dirección del remitente.
        to: email, // El que va a recibir el email.
        subject: subject, // Asunto del email.
        html: mailbody  // Contenido del mensaje en html.
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
    	if(err) {
    		console.log(err)
    	}

    	smtpTransport.close()
    })
}
