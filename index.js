const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
let multer = require('multer');


const app = express();

const middleware = [
    cors(),
    morgan("dev")
]


app.use(middleware)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
// console.log(process.env)
// connect with database
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltldm.mongodb.net/formBuilder?retryWrites=true&w=majority`
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    console.log("Database Connected")
    const database = client.db("formBuilder")
    const formsCollection = database.collection("forms")
    const formCollection = database.collection("form")


    app.get("/forms", async(req, res, next) => {
        try {

            let result = await formsCollection.find().toArray()
            res.status(200).json({
                success: true,
                result
            })
        } catch (err) {
            next(err)
        }
    })

    app.get("/forms/:id", async(req, res, next) => {
        try {

            let { id } = req.params

            let result = await formsCollection.findOne({ "_id": ObjectId(id) })
            res.status(200).json({
                success: true,
                result
            })
        } catch (err) {
            next(err)
        }
    })

    app.post("/forms", async(req, res, next) => {

        try {
            await formsCollection.insertOne(req.body)
            res.status(201).json({
                success: true,
            })
        } catch (err) {
            next(err)
        }
    })

    app.post("/form", async(req, res, next) => {
        try {
            await formCollection.insertOne(req.body)
            res.status(201).json({
                success: true,
            })
        } catch (err) {
            next(err)
        }
    })

    app.get("/form/:formId", async(req, res, next) => {
        let { formId } = req.params
            // console.log(formId)
        try {
            let result = await formCollection.find({ formId: formId }).toArray()
                // console.log(result)
            res.status(200).json({
                success: true,
                result
            })
        } catch (err) {
            next(err)
        }
    })

});

// run server
const port = process.env.PORT || 5050
app.listen(port, () => {
    console.log("Server running on port ", port)
})