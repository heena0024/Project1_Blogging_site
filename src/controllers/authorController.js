const authorModel = require('../models/authorModel')
//const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

//------------------------1st-CREATE AUTHOR-------------------------------

const createAuthor = async function (req, res) {

    try {
        const requestBody = req.body;
        const details= await authorModel.create(requestBody);                                  // create Author using create() 
        res.status(200).send({ msg: "Author created", details });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error:err.message},)
    }

}

///////////////////////////////////////////////////////

const login = async function (req, res) {
    try {
        let userEmail = req.body.email
        let userPassword = req.body.password
        if (userEmail && userPassword) {
            let User = await authorModel.findOne({ email: userEmail, password: userPassword, isDeleted: false })             // find Author in DB

            if (User) {
                const Token = jwt.sign({ userId: User._id }, "Thunders")                                 // create token
                res.header('x-api-key', Token)                                                           // send token 
         
                res.status(200).send({ status: true })
            } else {
                res.status(400).send({ status: false, Msg: " wrong Credentials Invalid Email or Password" })
            }
        } else {
            res.status(400).send({ status: false, msg: "Body must contain  email and password" })
        }
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}

//export API's logic
module.exports.login = login
module.exports.createAuthor = createAuthor;