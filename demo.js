const express = require('express');
const app=express();
const port=9000;
const { Server }= require("socket.io");

const path = require('path');
console.log(path.join(__dirname,"/public"));
const staticPath1=path.join(__dirname,"/public");
app.use(express.static(staticPath1));


//code by Arpan Garg
const chatServer=require('http').createServer(app);
//const io = require('socket.io').listen(chatServer);
//const chatSockets=require('../public/js/client.js').chatSockets(chatServer);

console.log('Chat server is listening on port 8000');



//const httpServer = createServer(app);

const io = new Server(chatServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  },
});

// app.use(express.static(staticPath2));

console.log(path.join(__dirname+'/public/demo.html'));
app.get('/',(req,res)=>{
     
    res.sendFile(path.join(__dirname+'/public/demo.html'));
});



const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("new user joined the chat", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

app.listen(port,()=>{
   
  console.log(`Host app listening on port ${port}`);

});
chatServer.listen(8000);

