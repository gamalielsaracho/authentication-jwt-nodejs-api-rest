import nodemailer from 'nodemailer'
import config from './config'

// BLOQUE algorithm.
const algorithm = 'aes-256-ctr'

const privateKey = config.key.privateKey

let smtpTransport = nodemailer.createTransport("SMTP", {
	service:'Gmail',
	auth: {
		user: config.email.username,
		pass: config.email.password
	}
})

console.log('seeeeee')
// BLOQUE sentMailVerificationLink
export default function sentMailVerificationLink(user, token) {
	let textLink = `http://${config.server.host}:${config.server.port}/${config.email.verifyEmailUrl}/${token}`

	let from = `${config.email.accountName} Team< ${config.email.username} >`
	let mailbody = `
		<p> Thanks for Registering on ${config.email.accountName} </p>
		<p>Please verify your email by clicking on the verification link below.<br/>
		<a href=${textLink.toString()}>Verification Link</a></p>
	`
	mail(from, user.username, 'Account Verification', mailbody)
}


export default function sentMailForgotPassword(user) {
	let from = `${config.email.accountName} Team< ${config.email.username} >`
	let mailbody = `
		<p> you ${config.email.accountName} Account Credential</p>
		<p>username: ${user.username} , password: ${decrypt(user.password)} </p>
	`
	mail(from, user.username, 'Account password', mailbody)
}


// BLOQUE mail

// from => quien envia.
// email => a quien vamos a enviar
// subject => asunto o tema.
// mailbody => todo el mensaje.

function mail(from , email, subject, mailbody) {
	let mailOptions = {
        from: from, // dirección del remitente.
        to: email, // el que va a recibir el email.
        subject: subject, // Asunto del email.
        html: mailbody  // contenido html
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
    	if(err) {
    		console.log(err)
    	}

    	smtpTransport.close()
    })
}