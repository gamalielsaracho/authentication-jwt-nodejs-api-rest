import Boom from 'boom'
import Config from '../config/config'
import jwt from 'jsonwebtoken'
import User from './user.model.js'
import crypto from '../config/crypto'
import nodemailer from '../config/nodemailer'


const privateKey = Config.key.privateKey
const tokenExpiry = Config.key.tokenExpiry

exports.register = function(req, res) {

	const passwordEncrypted = crypto.encrypt(req.body.password)

	User.findOne({ email: req.body.email })
	.then((existingUser) => {
		if(existingUser) {
			return res.send(Boom.forbidden('please provide another user email'));
		}

		let user = new User({
			email: req.body.email,
			password: passwordEncrypted
		})

		user.save()
		.then(() => {
			const tokenData = {
				id: user._id,
				email: user.email
			}

			const token = jwt.sign(tokenData, privateKey, { expiresIn: tokenExpiry })

			nodemailer.sentMailVerificationLink(user, token)

			return res.send(Boom.forbidden('Please confirm your email id by clicking on link in email'))
		})
		.catch((err) => {
			return res.send(Boom.forbidden(err))
		})

	})
	.catch((err) => {
		return res.send(Boom.forbidden(err))
	})
}

