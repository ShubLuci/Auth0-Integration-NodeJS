const express = require("express");
require("dotenv").config();
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();

// Use this to parse the req body
app.use(express.json());

// Use this to save the access token in the cookies
app.use(cookieParser());

const EXPRESS_PORT = process.env.EXPRESS_PORT;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_CONNECTION = process.env.AUTH0_CONNECTION;


// IIFE
(   
    () => {
        app.listen(EXPRESS_PORT, () => {
            console.log("src/index.js > EXPRESS SERVER RUNNING AT PORT "+EXPRESS_PORT);
        })
    }
)();

// Fetch Access Token
app.get('/getAccessToken', async (req,res) => {
    try {
        //Fetch Access Token
        const accessToken = await axios.post(
            `https://${AUTH0_DOMAIN}/oauth/token`,  //URL
            // Body
            {
                client_id: AUTH0_CLIENT_ID,
                client_secret: AUTH0_CLIENT_SECRET,
                audience: AUTH0_AUDIENCE,
                // change to 'password' if you wanna fetch token via password for user
                grant_type: "client_credentials"
            },
            // Headers
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        res.cookie("accessToken",accessToken.data.access_token);
        res.send(accessToken.data);
    } catch(err) {
        res.status(400).send({
            statusCode: 400,
            message: err.message
        });
    }
});


// API Path - https://auth0.com/docs/api/management/v2/users/post-users
// Scope Required - create:users
app.post('/registerUser', async (req,res) => {
    try {
        let {accessToken} = req.cookies;
        let {email,password,given_name,family_name} = req.body;
        let response = await axios.post(
            `https://${AUTH0_DOMAIN}/api/v2/users`,
            {
                email,
                password,
                given_name,
                family_name,
                connection: AUTH0_CONNECTION
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        res.send(response.data);
    } catch(err) {
        res.status(err.response?.status).send(err.response?.data);
    }
})

// API Path - https://auth0.com/docs/api/management/v2/users/get-users-by-id
// Scope Required - read:users, read:current_user, read:user_idp_tokens
app.get('/getUserProfileById/:id', async(req,res) => {
    try {
        let {accessToken} = req.cookies;
        let userProfile = await axios.get(
            `https://${AUTH0_DOMAIN}/api/v2/users/${req.params.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        res.send(userProfile.data);
    } catch(err) {
        res.status(err.response?.status).send(err.response?.data);
    }
});


// API Path - https://auth0.com/docs/api/management/v2/users-by-email/get-users-by-email
// Scope Required - read:users
app.get('/getUserProfileByEmail/:email', async(req,res) => {
    try {
        let {accessToken} = req.cookies;
        let userProfile = await axios.get(
            `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${req.params.email}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        res.send(userProfile.data);
    } catch(err) {
        res.status(err.response?.status).send(err.response?.data);
    }
});