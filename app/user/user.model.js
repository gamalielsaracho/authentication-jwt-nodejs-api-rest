import mongoose, { Schema } from 'mongoose'
import { db } from '../config/db'

console.log(db)

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
		default:'Admin'
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: String
	}
})

export default mongoose.model('User', UserSchema)