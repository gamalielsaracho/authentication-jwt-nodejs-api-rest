export default {
	server: {
		host: 'localhost',
		port: 3000
	},
	database: {
		host: 'localhost',
		post: 27017,
		db: 'administration',
		url: 'mongodb://127.0.0.1:27017/administration'
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