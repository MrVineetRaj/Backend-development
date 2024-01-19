// Importing the mongoose module
const mongoose = require('mongoose');

// Defining the schema for a task
taskSchema = mongoose.Schema({
    // The description of the task
    // It is a required field and will be trimmed
    description: {
        type: String,
        required: true,
        trim:true,
    },
    // The completion status of the task
    // It is not required and defaults to false
    completed: {
        type: Boolean,
        default: false,
    },
    // The owner of the task
    // It is a required field and references the User model
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

// Creating a model from the task schema
const Task = mongoose.model('Task', taskSchema)

// Exporting the Task model
module.exports = Task
