const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://gyaneshwer0001:gyaneshwer0001@cluster0.zpbmyjw.mongodb.net/loginRegister?retryWrites=true&w=majority').then(() => {
    console.log('Database connected')
})

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    }

})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}