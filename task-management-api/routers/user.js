// Importing the required modules
const express = require('express');
const User = require("../models/user")
const auth = require('../middleware/authantication')

// Creating a new router
const router = new express.Router();

// Route for creating a new user
router.post('/users',async (req,res) =>{
    // Creating a new user with the request body
    const user = new User(req.body);

    try{
        // Saving the user to the database
        await user.save()
        // Generating an authentication token for the user
        const token = await user.generateAuthToken()
        // Sending the user and token back in the response
        res.send({user,token})
    }
    catch(e){
        // Sending a 400 Bad Request status code and the error in the response if an error occurs
        res.status(400);
        res.send(e);
    }
})

// Route for logging in a user
router.post('/users/login', async(req,res) =>{
    try{
        // Finding the user by their email and password
        const user = await User.findByCredential(req.body.email,req.body.password);
        // Generating an authentication token for the user
        const token = await user.generateAuthToken()
        // Sending the user and token back in the response
        res.send({user,token});
    }
    catch(e){
        // Sending a 400 Bad Request status code in the response if an error occurs
        res.status(400).send();
    }
})

// Route for logging out a user
router.post('/users/logout',auth,async(req,res) =>{
    try{
        // Removing the token from the user's tokens array
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token;
        })

        // Saving the user to the database
        await req.user.save();

        // Sending a success message back in the response
        res.send()
    }catch(e){
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500).send()
    }
})

// Route for logging out a user on all devices
router.post('/users/logoutAll',auth,async(req,res) =>{
    try{
        // Removing all tokens from the user's tokens array
        req.user.tokens = []
        // Saving the user to the database
        await req.user.save();
        // Sending a success message back in the response
        res.send()
    }catch(e){
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500).send()
    }
})

// Route for getting the authenticated user
router.get('/users/me',auth,async (req,res)=>{
    // Sending the authenticated user back in the response
    res.send(req.user);
})

// Route for updating the authenticated user
router.patch('/users/me',auth, async (req,res)=>{
    // Getting the keys of the updates from the request body
    const updates = Object.keys(req.body);
    // Defining the allowed updates
    const allowedUpdates = ["name","age","password","email"];
    // Checking if all updates are allowed
    const isVaidOperation = updates.every((update) => allowedUpdates.includes(update));

    // If not all updates are allowed, send a 400 Bad Request status code and an error message in the response
    if(!isVaidOperation){
        return res.status(400).send({error:"Invalid updates"});
    }
    try{
        // Updating the user with the updates from the request body
        updates.forEach((update) =>{
            req.user[update] = req.body[update]
        })

        // Saving the updated user to the database
        await req.user.save()

        // Sending the updated user back in the response
        res.send(req.user);
    }
    catch(e){
        // Sending a 500 Internal Server Error status code in the response if an error occurs
        res.status(500).send();
    }
})

// Route for deleting the authenticated user
router.delete('/users/me',auth, async (req,res)=>{
    try{
        // Deleting the authenticated user
        await req.user.deleteOne()
        // Sending a success message back in the response
        res.send("User Deleted successfully ... !");
    }
    catch(e){
        // Logging the error and sending a 500 Internal Server Error status code in the response if an error occurs
        console.log(e);
        res.status(500).send(e);
    }
})

// Exporting the router
module.exports = router;
