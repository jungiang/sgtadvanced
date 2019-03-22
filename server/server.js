const express = require('express'); //load the express library into the file

const server = express();

server.use(express.static(__dirname + '/html'));

// var insults = [
//     'your father smelt of elderberries',
//     'you program on an altaire',
//     'I bet you still var',
//     'one line functions are for chumps'
// ]

//1st param: takes url to listen for
//2nd param: the callback function to call once that path has been received
// server.get('/', (request, response)=>{
    //receives two things
    //an object representing all the data coming from the client to the server
    //an object represeting all of the data going from the server to the client
//     response.send('hello, world');
// });

//server.get(path, anonymous callback function{work})

// server.get('/time',(request, response)=>{
//     var now = new Date();
//     response.send(now.toLocaleDateString());
// })

// server.get('/insult',(request, response)=>{
//     var random = Math.floor(Math.random()*3+1);
//     response.send(insults[random]);
// })

server.get('/api/grades', (req, res)=>{
    res.send(`{
        "success": true,
        "data": [{
            "id": 10,
            "name": "daniel paschal",
            "course": "linear algebra",
            "grade": 80
        }, {
            "id": 12,
            "name": "sandy happyfeet",
            "course": "penguin dancing",
            "grade": 80
        }, {
            "id": 14,
            "name": "chewie bacca",
            "course": "porg roasting",
            "grade": 89
        }]
    }`)
})

server.listen(3001, ()=>{
    console.log('server is running on port 3001');
    console.log('carrier has arrived');
});