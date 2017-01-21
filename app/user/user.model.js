import mongoose, { Schema } from 'mongoose'
import { db } from '../config/db'
import bcrypt from 'bcrypt-nodejs'


const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true 
	},
	password: {
		type: String,
		required: true
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	role: {
		type: String,
		enum: ['Client', 'Manager', 'Admin'],
		default:'Client'
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: String
	}
})


UserSchema.methods.encryptPassword = (userPassword) => {
	const hash = bcrypt.hashSync(userPassword)

	return hash
}

UserSchema.methods.comparePassword = (userPassword) => {

	return bcrypt.compareSync(userPassword, UserSchema.password)
}

export default mongoose.model('User', UserSchema)

