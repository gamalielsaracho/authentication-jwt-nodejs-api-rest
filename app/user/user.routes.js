import UserController from './user.controller'

export default (app) => {
	app.route('/user/register')
	   .post(UserController.register)
	   
	app.route('./user/verifyEmail/:token')
	   .post(UserController.verifyEmail)
}