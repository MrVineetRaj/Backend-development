// Importing the jsonwebtoken module
const jwt = require("jsonwebtoken");

// Importing the User model
const User = require('../models/user')

// Defining the authentication middleware
const auth = async (req, res, next) => {
    try {
        // Extracting the token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verifying the token
        const decoded = jwt.verify(token, 'thisismycourse');

        // Finding the user associated with the token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        // If no user is found, throw an error
        if (!user) {
            throw new Error();
        }

        // If a user is found, attach the token and user to the request
        req.token = token;
        req.user = user;

        // Proceed to the next middleware function
        next()
    }
    catch (e) {
        // If an error is caught, send a 401 Unauthorized response
        res.status(401).send({ error: "Please Authenticate" })
    }
}

// Exporting the authentication middleware
module.exports = auth;
