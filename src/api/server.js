const express = require('express')
var axios = require('axios');

const app = express()
const port = 3001

function newUser(phoneInput, adminInput) {
    return JSON.stringify({
        "collection": "users",
        "database": "calendar",
        "dataSource": "calendar",
        "document": {
            "phone": phoneInput,
            "isAdmin": adminInput,
            "blocked": false
        }
    })
}

function newEvent(startInput, nameInput, noteInput="") {
    return JSON.stringify({
        "collection": "events",
        "database": "calendar",
        "dataSource": "calendar",
        "document": {
            "start": startInput,
            "name": nameInput,
            "note": noteInput
        }
    })
}

function postReq(data){
    var config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-cxmmn/endpoint/data/v1/action/insertOne',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': '0m9cDmNHPSCDagQnbbBdSXoMOW0rwLoTwBUr9ViWtgaX2hJ0pQkIo3NveHNpC7zZ',
        },
        data: data
    };
    
    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

exports.newUser = newUser
exports.newEvent = newEvent
exports.postReq = postReq



app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
      app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  