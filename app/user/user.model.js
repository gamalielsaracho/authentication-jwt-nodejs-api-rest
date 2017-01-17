import mongoose, { Schema } from 'mongoose'
import { db } from '../config/db'

console.log(db)

const UserSchema = new Schema({
	username: {
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
	}
})

export default mongoose.model('User', UserSchema)