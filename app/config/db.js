import mongoose from 'mongoose'
import config from './config'

let db = mongoose.connect(config.database.url)
	.then(() => {
		console.log(`database connected`)
	})
	.catch((err) => {
		console.log(`Error: ${err}`)
	})
	
export default db

