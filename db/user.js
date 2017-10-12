const tools  = require('../helpers/tools'),
      userDB = require('./db').userDatabase,
      urlDB  = require('./db').urlDatabase,
      URL    = require('./url'),
      Model  = require('./db').Model,      
      bcrypt = require('bcrypt')

class User extends Model {
    constructor(email, password) {
        super()
        if (!email || !password) return false
        if (User.find({email: email})) return false

        this.id         = tools.generateRandomString(6)        
        this.email      = email
        this.password   = bcrypt.hashSync(password, 10)
        
        if (this.save()) {
            return this            
        } else {
            return false
        }
    }

    update() {
        const _user = this.retrieveDBCopy()
        
        if (this.password !== _user.password) {
            this.password = bcrypt.hashSync(this.password, 10)
        }

        if (this.save()) {
            return this            
        } else {
            return false
        }
    }

    urls() {
        return URL.findAll({userID: this.id})
    }

    static verifyPassword(email, password) {
        if (!email || !password) return false

        const user = this.find({email: email})

        if (user && bcrypt.compareSync(password, user.password)) {
            return user
        } else {
            return false
        }
    }

    static verifySession(session) {
        
        if (!session.user_id) {
            return false
        } else {
            let user = this.find(session.user_id)
            if (user) {
                return session.user_id
            } else {
                session.user_id = null
                return false
            }       
        }
    }
}

module.exports = User