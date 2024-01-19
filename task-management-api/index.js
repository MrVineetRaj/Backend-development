// Importing the required modules
const express = require('express');
// Connecting to the MongoDB database
require('./db/mongoose')

// Importing the routers for users and tasks
const routerUser = require('./routers/user')
const routerTask = require('./routers/task')

// Creating a new Express application
const app = express();
// Defining the port on which the server will run
const port= 3000;

// Using the built-in JSON middleware to parse JSON request bodies
app.use(express.json())

// Using the user router for all user routes
app.use(routerUser)

// Using the task router for all task routes
app.use(routerTask);

// Starting the server on the defined port
app.listen(port,()=>{
    // Logging a message to the console when the server is up and running
    console.log(`Server is up on port ` + port) 
})



