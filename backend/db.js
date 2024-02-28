const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://gyaneshwer0001:gyaneshwer0001@cluster0.zpbmyjw.mongodb.net/paytm?retryWrites=true&w=majority').then(() => {
    console.log('Database connected')
})

// create schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

// create model
const User = mongoose.model('User', UserSchema);

// export model
module.exports = {
    User
}