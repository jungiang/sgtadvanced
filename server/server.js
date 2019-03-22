const express = require('express'); //load the express library into the file

const server = express();

server.use(express.static(__dirname + '/html'));

var insults = [
    'your father smelt of elderberries',
    'you program on an altaire',
    'I bet you still var',
    'one line functions are for chumps'
]

//1st param: takes url to listen for
//2nd param: the callback function to call once that path has been received
server.get('/', (request, response)=>{
    //receives two things
    //an object representing all the data coming from the client to the server
    //an object represeting all of the data going from the server to the client
    response.send('hello, world');
});

server.get('/time',(request, response)=>{
    var now = new Date();
    response.send(now.toLocaleDateString());
})

server.get('/insult',(request, response)=>{
    var random = Math.floor(Math.random()*3+1);
    response.send(insults[random]);
})

server.listen(3001, ()=>{
    console.log('server is running on port 3001');
    console.log('carrier has arrived');
});