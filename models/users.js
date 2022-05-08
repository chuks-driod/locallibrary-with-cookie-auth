var bcrypt = require('bcrypt');
var isEemail = require('validator');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        // validate: isEemail
    },
    password: {
        type: String,
        required: true
    }
})


// fire a function before doc saved to db
UsersSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Users', UsersSchema);