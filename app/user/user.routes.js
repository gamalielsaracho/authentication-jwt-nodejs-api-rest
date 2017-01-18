import UserController from './user.controller.js'

export default (app) => {
	app.post('/register', UserController.register)
}