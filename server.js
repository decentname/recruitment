var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var response={users:[]};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname+ '/views/index.html'));
});

io.on('connection', function(socket){

  console.log('a user connected');
  
  socket.on('username',function(data){
    console.log(data.username+' is connected');
    
    var client_ip_address = socket.request.connection.remoteAddress
    response.users.push({name: data.username+" ["+client_ip_address+"]" , socket: socket.id, avatar: data.avatar});
    
    console.log('CONNECTED USERS: ');
    console.log(response.users);
    io.emit('show connected users',response);
  });

  
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var index='';
    
    for(i in response.users){
      if(response.users[i].socket == socket.id){
        index=i;
        break;
      }
    }
    
    response.users.splice(index,1);
    io.emit('remove disconnected users',socket.id);
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});