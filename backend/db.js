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


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // it ensures ki i can not put anythign in account table that doesnot 
        // have corresponding user here only with user wiht certain id exists will be able to store 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})







// create model
const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', accountSchema);
// export model
module.exports = {
    User,
    Account
}