import Boom from 'boom'
import Config from '../config/config'
import jwt from 'jsonwebtoken'
import User from './user.model.js'
import nodemailer from '../config/nodemailer'
import crypto from 'crypto'

const privateKey = Config.key.privateKey
const tokenExpiry = Config.key.tokenExpiry

// 1.
exports.register = (req, res) => {

	User.findOne({ email: req.body.email })
	.then((existingUser) => {
		if(existingUser) {
			return res.send(Boom.forbidden('please provide another user email'));
		}

		let user = new User()

		user.email = req.body.email
		user.password = user.encryptPassword(req.body.password)

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

// 3.
exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
	.then((user) => {
		if(user.comparePassword(req.body.password, user.password)) {
			if(!user.isVerified) {
				return res.send(Boom.forbidden('Your email address is not verified. please verify your email address to proceed'))
			}

			const tokenData = {
				id: user._id,
				email: user.email
			}

			const token = jwt.sign(tokenData, privateKey, { expiresIn:tokenExpiry })

			return res.json(token)
		}else {
			return res.send(Boom.forbidden('invalid username or password'))
		}
	})
	.catch((err) => {
		return res.send(Boom.badImplementation(err))
	})
}

// 4.
exports.resendVerificationEmail = (req, res) => {
	User.findOne({ email:req.body.email })
	.then((user) => {
		if(user.comparePassword(req.body.password, user.password)) {
			if(user.isVerified) {
				return res.send(Boom.forbidden('your email address is already verified'))
			}

			const tokenData = {
				id: user._id,
				email: user.email
			}

			const token = jwt.sign(tokenData, privateKey, { expiresIn:tokenExpiry })

			nodemailer.sentMailVerificationLink(user, token)

			return res.send(Boom.forbidden('account verification link is sucessfully send to an email id'))
		}else {
			return res.send(Boom.forbidden('invalid email or password'))
		}
	})
	.catch((err) => {
		return res.send(Boom.badImplementation(err))
	})
}

// 5.
exports.forgotPassword = (req, res, next) => {
	const email = req.body.email

	User.findOne({ email: email })
	.then((user) => {
		if(user == null) {
			res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' })
		}

		crypto.randomBytes(48, (err, buffer) => {
			if(err) {
				return next(err)
			}

			const resetToken = buffer.toString('hex')
			user.resetPasswordToken = resetToken
			user.resetPasswordExpires = Date.now() + 3600000

			user.save()
			.then(() => {
				nodemailer.sentMailForgotPassword(user)

				res.status(200).json({ message:'Please check your email for the link to reset your password.' })
				next()
			})
			.catch((err) => {
				return next(err)
			})
		})

	})
	.catch((err) => {
		return next(err)
	})
}

// 6.
exports.verifyToken = (req, res, next) => {
	User.findOne({ resetPasswordToken: req.params.resetPasswordToken, resetPasswordExpires: Date.now() })
	.then((user) => {
		if(!user) {
			res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' })
		}

		user.password = req.body.password
		user.resetPasswordToken = undefined
		user.resetPasswordExpires = undefined

		user.save()
		.then(() => {
			nodemailer.sentMailPasswordChanged(user)

			res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' })
			
			next()
		})
		.catch((err) => {
			return next(err)
		})
	})
	.catch((err) => {
		return next(err)
	})
}

// 7.
exports.roleAuthorization = (role) => {
	return (req, res, next) => {
		const token = req.body.token || req.query.token || req.headers['x-access-token']
		
		if(token) {
			jwt.verify(token, privateKey)
			.then((decoded) => {
				if(decoded.exp <= Date.now()) {
					res.status(401).json({ error: 'Token Expired' })
				}else {
					if(decoded.role == role) {
						return next()
					}else {
						res.status(401).json({ error: 'You are not authorized to view this content.' })
					}
				}
			})
			.catch((err) => {
				return next(err)
			})
		}else {
			res.status(401).json({ error: 'You should sign in' })
		}
		
	}
}