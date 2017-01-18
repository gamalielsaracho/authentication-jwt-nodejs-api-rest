import crypto from 'crypto'
const algorithm = 'aes-256-ctr'

import config from './config'

export default {
	decrypt: (password) => {
		let decipher = crypto.createDecipher(algorithm, config.key.privateKey)
	    let dec = decipher.update(password, 'hex', 'utf8')
	    dec += decipher.final('utf8')
	    return dec
	},
	encrypt: (password) => {
		let cipher = crypto.createCipher(algorithm, config.key.privateKey)
	    let crypted = cipher.update(password, 'utf8', 'hex')
	    crypted += cipher.final('hex')
	    return crypted
	}
}