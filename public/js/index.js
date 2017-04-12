var socket=io();
var ipTemplate = $.templates("#ipTemplate");
var imageSelectedSrc = "";    
    

var data={
      
      addConnectedUsers: function(users){
        $.observable(this.online).insert(0,users);
      },
      removeDisconnectedUser: function(index){
        $.observable(this.online).remove(index);        
      },     
      
      name:'',
      avatarsrc:'',
      myAvatar:'',
      online:[],
      
    }

$(document).ready(function () {
   ipTemplate = $.templates("#ipTemplate");   
   imageSelectedSrc = "";  
  
    $('.userInfo').submit(function(e){
      e.preventDefault();     
      data.name=$('#name').val();     
      
      if($('#name').val()==''){
        alert("Username cannot be empty!");
      }      
      else{
        data.name=$('#name').val();     
        data.avatarsrc=imageSelectedSrc.substr(imageSelectedSrc.length-5)[0] || '1';
        socket.emit('username',{username:$('#name').val(), avatar:data.avatarsrc});
        ipTemplate.link('.mainContainer',data);
        $(".userAvatar").attr("src","images/avatar-"+data.avatarsrc+".png");
        data.myAvatar="<img class=\"myAvatar\" src=\"images/avatar-"+data.avatarsrc+".png\">";
      }
      
      
    });

    function selectAvatar(e){
      imageSelectedSrc = e.path[0].src;
      this.style.border = "0.25rem solid white";
      for(i in avatars){
        if(avatars[i]!=this){
          // console.log(avatars[i].style.border);
          avatars[i].style.border="none";
        }
      } 
    }

    const avatars = document.querySelectorAll('img');
    avatars.forEach(avatar => avatar.addEventListener('click',selectAvatar));

    socket.on('show connected users',function(response){
      var users = response.users;
      var startindex = data.online.length;
      var temp=[];

      for(i=startindex; i<users.length; i++){
        users[i].avatar="<img class=\"onlineUserAvatar\" src=\"images/avatar-"+users[i].avatar+".png\">";
          temp.push(users[i]);
        }     
      data.addConnectedUsers(temp);
      
    });

    socket.on('remove disconnected users',function(socketID){
      for(i in data.online){
        if(data.online[i].socket==socketID){
          data.removeDisconnectedUser(i);
        }
      }
    });

       

});

