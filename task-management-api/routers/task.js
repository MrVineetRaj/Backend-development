// Importing the required modules
const express = require('express');
const Task = require("../models/task")
const auth = require("../middleware/authantication")

// Creating a new router
const router = new express.Router();

// Route for creating a new task
router.post('/tasks',auth,async (req,res) =>{
    // Creating a new task with the request body and the owner set to the authenticated user's id
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        // Saving the task to the database
        await task.save()
        // Sending the task back in the response
        res.send(task)
    }
    catch(e){
        // Sending a 400 Bad Request status code and the error in the response if an error occurs
        res.status(400);
        res.send(e);
    }
})

// Route for getting all tasks of the authenticated user
router.get('/tasks',auth,async (req,res)=>{
    try{
        // Finding all tasks of the authenticated user
        const tasks = await Task.find({owner:req.user._id})
        // Sending the tasks back in the response
        res.send(tasks);
    }
    catch(e){
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500);
    }
})

// Route for getting a specific task of the authenticated user
router.get('/tasks/:id',auth,async (req,res)=>{
    try{
        // Finding the task with the provided id that belongs to the authenticated user
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        if(!task){
            // Sending a 404 Not Found status code in the response if no task is found
            return res.status(404).send();
        }
        // Sending the task back in the response
        res.send(task);
    }
    catch(e){
        // Logging the error and sending a 500 Internal Server Error status code in the response if an error occurs
        console.log(e);
        res.status(500).send(e);
    } 
})

// Route for deleting a specific task of the authenticated user
router.delete('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id; 

    try{
        // Deleting the task with the provided id that belongs to the authenticated user
        const task = await Task.findByIdAndDelete({_id,owner:req.user._id});
        if(!task){
            // Sending a 404 Not Found status code in the response if no task is found
            return res.status(404).send();
        }

        // Sending a success message back in the response
        res.send("Task Deleted successfully ... !");
    }
    catch(e){
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500).send();
    }
})

// Route for updating a specific task of the authenticated user
router.patch('/tasks/:id',auth, async (req,res)=>{
    // Getting the keys of the updates from the request body
    const updates = Object.keys(req.body)
    // Defining the allowed updates
    const allowedUpdates = ['description','completed']
    // Checking if all updates are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    // If not all updates are allowed, send a 400 Bad Request status code and an error message in the response
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Update"})
    }

    try{
        // Finding the task with the provided id that belongs to the authenticated user
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});
        // Updating the task with the updates from the request body
        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        // Saving the updated task to the database
        await task.save()
        
        // If no task is found, send a 404 Not Found status code in the response
        if(!task){
            return res.status(404).send(e);
        }

        // Logging a success message and sending the updated task back in the response
        console.log("Task Updated successfully ... !");
        res.send(task);
    }
    catch(e){
        // Logging the error and sending a 500 Internal Server Error status code in the response if an error occurs
        console.log(e);
        res.status(500).send();
    }
})

// Exporting the router
module.exports = router;
