const mongoose = require('mongoose')
const { hash } = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { 
        primaryKey: true,
        type: String, 
        required: true,
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function (v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} invalid email address`
          }
    },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const hashedPassword = await hash(this.password, 10)
        this.password = hashedPassword
    }
    next()
})

module.exports =  mongoose.model('users', userSchema)