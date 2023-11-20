import express from 'express';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createServer } from 'node:http';
import {Server}  from 'socket.io';
import Filter from 'bad-words';
const filter= new Filter()

const app=express();
const server = createServer(app);
const io=new Server(server);

const port=process.env.PORT||3000;

app.set('views',path.join(__dirname,'../views'))

app.use(express.static(path.join(__dirname,"../public")))



app.get('/', (req, res) => {
    res.send("index.html");
  });

io.on('connection', (socket) => {
  socket.emit('greetings',"Welcome to this chat. Have Fun! :)");
  socket.broadcast.emit("greetings","A new user has joined")


    socket.on('chat message',(msg,callback)=>{
        io.emit('chat message', filter.clean(msg));
        callback('The message was recived by the server')
    });

    socket.on('geolocation',(coords,callback)=>{
      io.emit("geolocation",`https://www.google.com/maps/@${coords.latitude},${coords.longitude}`)
      callback("The location was send")
    });
    
    socket.on('disconnect',()=>{
      io.emit('greetings',"A user have left")
    })
  });

server.listen(port,(req,res)=>{
    console.log("Server is up and running on ",port)
})