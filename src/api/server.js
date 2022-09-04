const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3001

app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port) 

const uri = "mongodb+srv://Yonatan:Z1x2c3v4y@calendar.x0xgfz3.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect().then(
    client => {
        const eventCollection = client.db("calendar").collection("events")
        const userCollection = client.db("calendar").collection("users")

        app.get('/events', (req, res) => {
            eventCollection.find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => console.error(error))
        })

        app.post('/events', (req, res) => {
            eventCollection.insertOne(req.body, function(err, result){
                if (err) throw err
                res.json(result);
            })
        })

        app.delete('/events', (req, res) => {
            eventCollection.deleteOne(eventCollection.findOne(req.body), function(err, result){
                if (err) throw err
                res.json(result);
            })
        })
        
        app.get('/users', (req, res) => {
            userCollection.find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => console.error(error))
        })
    }
).catch(console.error)

client.close();