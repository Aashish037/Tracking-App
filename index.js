const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", (socket)=>{
    console.log("connected");
    socket.on("send-location", (data)=>{
        io.emit("receive", {id: socket.id, ...data});
    })

    socket.on("disconnect", ()=>{
        io.emit("user disconnected", socket.id);
        console.log("User disconnected", socket.id);
    })
})

app.get('/', (req, res) => {
    res.render('index');
})

server.listen(3000);

// app.listen(3000, (req, res) => {
//     console.log('Server is running on port 3000');
// })