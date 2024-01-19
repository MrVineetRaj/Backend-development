// Importing the mongoose module
const mongoose = require('mongoose');

// Connecting to the MongoDB server at the provided URL
// The database we are connecting to is 'task-manager-api'
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');
