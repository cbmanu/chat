import express from 'express';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createServer } from 'node:http';
import {Server}  from 'socket.io';
import Filter from 'bad-words';
import {generateMessage} from './utils/messages.mjs'
import {addUser,removeUser,getUser,getUsersInRoom} from './utils/users.mjs'
import { create } from 'express-handlebars';
import favicon  from 'express-favicon';
import indexRoutes from './routes/index.routes.js'
const filter= new Filter()

const app=express();
const server = createServer(app);
const io = new Server(server, {
  ackTimeout: 10000,
  retries: 3
});

const port=process.env.PORT||8080;
app.use(express.static(path.join(__dirname,"../public")))



const hbs = create({
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));





app.use(express.urlencoded({extended: false}));

app.use(indexRoutes);



io.on('connection', (socket) => {

    socket.on('join',({username,room},callback)=>{
      const {error,user}=addUser({
        id:socket.id,
        username,
        room
      })
      if(error){
        return callback(error)
      }
      socket.join(user.room)
      socket.emit('chat message',generateMessage("Welcome to this chat. Have Fun! :)"));
      socket.broadcast.to(user.room).emit("chat message",generateMessage(`${user.username} has joined`));

      io.to(user.room).emit('room data',{
        users:getUsersInRoom(user.room),
        room:user.room
      })
      callback()

    })
    
    socket.on('user message',(msg,callback)=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('user message',generateMessage(filter.clean(msg)),user.username);
        socket.to(user.room).emit('sound');
        callback('The message was recived by the server');
    });
    socket.on("writing",()=>{
      const user=getUser(socket.id);
      socket.broadcast.to(user.room).emit('writing',(user.username));
    })

    socket.on('geolocation',(coords,callback)=>{
      const user=getUser(socket.id);
      console.log(coords)
      io.to(user.room).emit("geolocation",generateMessage(`https://www.google.com/maps/search/?api=1&query=${coords.latitude}%2c${coords.longitude}`),user.username)
      socket.to(user.room).emit('sound');
      callback("The location was send")
    });
    
    socket.on('disconnect',()=>{
      const user=removeUser(socket.id);
      if(user){
        io.to(user.room).emit('chat message',generateMessage(`${user.username} have left`));
        io.to(user.room).emit('room data',{
          users:getUsersInRoom(user.room),
          room:user.room
        })
      }
    })
  });

  app.use(favicon(__dirname + '../public/img/favicon.png'));
  app.use(express.urlencoded({extended: false}));

server.listen(port,(req,res)=>{
    console.log("Server is up and running on ",port)
})