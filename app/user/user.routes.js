import UserController from './user.controller'

export default (app) => {
	app.route('/users')
	   .get(UserController.users)

	app.route('/user/register')
	   .post(UserController.register)
	   
	app.route('/user/verifyEmail/:token')
	   .post(UserController.verifyEmail)

}