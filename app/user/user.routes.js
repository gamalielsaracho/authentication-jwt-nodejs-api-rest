import UserController from './user.controller'

export default (app) => {
	app.route('/user/register')
	   .post(UserController.register)

	app.route('/user/verifyEmail/:token')
	   .get(UserController.verifyEmail)

	app.route('/user/login')
	   .post(UserController.login)

	app.route('/user/resendVerificationEmail')
	   .post(UserController.resendVerificationEmail)

	app.route('/user/forgotPassword')
	   .post(UserController.forgotPassword)

	app.route('/user/verifyToken/:resetPasswordToken')
	   .get(UserController.verifyToken)
}