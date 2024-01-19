// Importing the required modules
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// Importing the Task model
const Task = require('../models/task')

// Defining the schema for a user
userSchema = mongoose.Schema({
    // The name of the user
    // It is a required field and will be trimmed
    // It is unique, meaning no two users can have the same name
    name: {
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    // The password of the user
    // It is a required field and will be trimmed
    // It has a custom validator to ensure it does not contain the word "password" and is at least 7 characters long
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                alert("Password cannot contain 'password'")
                throw new Error("Password cannot contain 'password'");
            }
            if(value.length < 7){
                alert("Password must be at least 7 characters long")
                throw new Error("Password must be at least 7 characters long");
            }
        }
    },
    // The email of the user
    // It is unique and will be converted to lowercase and trimmed
    // It has a custom validator to ensure it is a valid email
    email: {
        type: String,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value) {
            if (!(validator.isEmail(value))) {
                throw new Error("Email is not valid");
            }
        }
    },
    // The age of the user
    // It is not required and defaults to 10 if not provided
    // It has a custom validator to ensure it is a positive number
    age: {
        type: Number,
        default:10,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    // The tokens of the user
    // This is an array of token objects
    // Each token object has a token property which is a required string
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

// Defining a virtual property 'tasks'
// This property establishes a relationship between the User and Task models
// The 'localField' is the field in this model that is used for the relationship
// The 'foreignField' is the field in the Task model that is used for the relationship
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// Overriding the toJSON method of the userSchema
// This function is called when the user object is stringified
// It deletes the password and tokens properties from the user object
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// Defining a method 'generateAuthToken' on the userSchema
// This method generates a token for the user, adds it to the user's tokens array, and saves the user
userSchema.methods.generateAuthToken = async function (){
    const user = this;
    
    const token = jwt.sign({_id:user._id.toString()}, 'thisismycourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token;
}

// Defining a static method 'findByCredential' on the userSchema
// This method finds a user by email and then checks if the provided password matches the user's password
userSchema.statics.findByCredential = async function (email,password){
    const user = await User.findOne({email});

    if(!user){
        throw new Error("unable to Login");
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("unable to Login");
    }

    return user;
}

// Defining a pre-save hook on the userSchema
// This function is called before a user is saved
// If the user's password is modified, it hashes the password
userSchema.pre('save',async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    next()
})

// Defining a pre-remove hook on the userSchema
// This function is called before a user is removed
// It deletes all tasks associated with the user
userSchema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id})
    next()
})

// Creating a model from the user schema
const User = mongoose.model('User', userSchema)

// Exporting the User model
module.exports = User;
