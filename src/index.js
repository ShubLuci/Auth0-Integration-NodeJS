const express = require("express");
require("dotenv").config();
const axios = require('axios');

const app = express();
app.use(express.json());

const EXPRESS_PORT = process.env.EXPRESS_PORT;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;


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
                //grant_type is client credentials, use this when you want to 
                grant_type: "client_credentials"
            },
            // Headers
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        res.send(accessToken.data);
    } catch(err) {
        res.status(400).send({
            statusCode: 400,
            message: err.message
        });
    }
});
