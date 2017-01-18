import express from 'express'
import bodyParser from 'body-parser'
import config from './app/config/config'
import db from './app/config/db'
import routes from './app/routes'

// Declaramos app como express para hacer uso de la misma.
const app = express()

app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

routes(app)

// BLOQUE port.
const port = config.server.port

// Declaramos server y llamamos a la función listen y le pasamos como parámetro el puerto al cual queremos escuchar.
app.listen(port)

// Imprimimos este mensaje que se mostrará en nuestra terminal 
// al correr nuestro servidor.
console.log(`corriendo en el puerto ${port}`)

// Esto nos autorizara para que podamos usar nuestra api, en el front-end
// y podamos hacer peticiones get, post, put, y delete. 
// Le pasamos http://localhost:8080 para que solamente nosotros podamos usar 
//nuestra API lo cual es super segura.

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "http://localhost:8080")
// 	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials")
// 	res.header("Access-Control-Allow-Credentials", true)
// 	next()
// })