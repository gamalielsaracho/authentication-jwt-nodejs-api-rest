import Boom from 'boom'
import Config from '../config/config'
import jwt from 'jsonwebtoken'
import User from './user.model.js'
import crypto from '../config/crypto'
import nodemailer from '../config/nodemailer'

const privateKey = Config.key.privateKey
const tokenExpiry = Config.key.tokenExpiry

// 1.
exports.register = (req, res) => {

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

// 2.
exports.verifyEmail = (req, res) => {

	const token = req.params.token

	jwt.verify(token, privateKey)
	.then((decoded) => {
		if(decoded == undefined) {
			return res.send(Boom.forbidden('invalid verification link'))
		}

		if(decoded.scope[0] != 'Customer') {
			return res.send(Boom.forbidden('invalid verification link'))
		}

		User.findOne({ _id:decoded._id, email:decoded.email })
		.then((user) => {
			if(user == null) {
				return res.send(Boom.forbidden('invalid verification link'))
			}

			if(user.isVerified == true) {
				return res.send(Boom.forbidden('account is already verified'))
			}

			user.isVerified = true

			user.save()
			.then(() => {
				return res.send(Boom.forbidden('account sucessfully verified'))
			})
			.catch((err) => {
				return res.send(Boom.badImplementation(err))
			})

		})
		.catch((err) => {
			return res.send(Boom.badImplementation(err))
		})
	})
	.catch((err) => {
		console.log(err)
	})
}