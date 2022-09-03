const express = require('express')
const app = express()
const port = 3001
const cors = require("cors")


async function api(){


    
    const headersList = new Headers();

    headersList.append("Accept", "*/*")
    headersList.append("Content-Type", "application/json")
    headersList.append("api-key", "0m9cDmNHPSCDagQnbbBdSXoMOW0rwLoTwBUr9ViWtgaX2hJ0pQkIo3NveHNpC7zZ")
    headersList.append("Access-Control-Allow-Credentials", "true")
    headersList.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    headersList.append("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")


    let bodyContent = JSON.stringify({
        "dataSource": "calendar",
        "database": "calendar",
        "collection": "events"
    });

    const myInit = {
        method: 'POST',
        headers: headersList,
        body: bodyContent,
        mode: 'cors',
        cache: 'default'
    };

    const myRequest = new Request('https://data.mongodb-api.com/app/data-cxmmn/endpoint/data/v1/action/find', myInit);

    const result = await fetch(myRequest).then((response) => {return response.json()});

    app.use(cors({origin: '*'}));

    app.get('/', (req, res) => {res.send(result)})
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
    } 

api()

// function newUser(phoneInput, adminInput) {
//     return JSON.stringify({
//         "collection": "users",
//         "database": "calendar",
//         "dataSource": "calendar",
//         "document": {
//             "phone": phoneInput,
//             "isAdmin": adminInput,
//             "blocked": false
//         }
//     })
// }

// function newEvent(startInput, nameInput, noteInput="") {
//     return JSON.stringify({
//         "collection": "events",
//         "database": "calendar",
//         "dataSource": "calendar",
//         "document": {
//             "start": startInput,
//             "name": nameInput,
//             "note": noteInput
//         }
//     })
// }

// function postReq(data){
//     var config = {
//         method: 'post',
//         url: 'https://data.mongodb-api.com/app/data-cxmmn/endpoint/data/v1/action/insertOne',
//         headers: {
//             'Content-Type': 'application/json',
//             'Access-Control-Request-Headers': '*',
//             'api-key': '0m9cDmNHPSCDagQnbbBdSXoMOW0rwLoTwBUr9ViWtgaX2hJ0pQkIo3NveHNpC7zZ',
//         },
//         data: data
//     };
    
//     axios(config)
//         .then(function (response) {
//             console.log(JSON.stringify(response.data));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }

// exports.newUser = newUser
// exports.newEvent = newEvent
// exports.postReq = postReq


