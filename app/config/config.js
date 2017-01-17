export default {
	server: {
		host: 'localhost',
		post: 3000
	},
	database: {
		host: 'localhost',
		post: 27017,
		db: 'hola',
		url: 'mongodb://127.0.0.1:27017/hola'
	},
	key: {
		privateKey: 'mysupersecretkey',
		tokenExpiry: '7d' 
	},
	email: {
		username:'********@gmail.com',
		password:'*******',
		accountName: 'gmail',
		verifyEmailUrl: 'verifyEmail'
	}
}