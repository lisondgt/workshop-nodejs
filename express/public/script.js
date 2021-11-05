var socket = io();
var messages = document.getElementById('messages');

var formLogIn = document.getElementById("form-login");
var inputLogIn = document.getElementById("input-login");

let selectedRoom = null;

let form = document.createElement("form");
form.id = "form";

let input = document.createElement("input");
input.type = "text";
input.id = "input";
input.className = "form-control";

let button = document.createElement("button");
button.type = "submit";
button.textContent = "Send";
button.className = "btn btn-primary";

form.appendChild(input);
form.appendChild(button);

formLogIn.addEventListener("submit", function (e) {
    e.preventDefault();
    if (inputLogIn.value) {
        socket.emit("_handleUsers", inputLogIn.value);
        inputLogIn.value = '';
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("_handleChat", {msg:input.value,selectedRoom:selectedRoom});
        input.value = "";
    }
});

function timestampToCleanTime(timestamp){
    let date = new Date(timestamp);

    let hour = this.zeroNumber(date.getHours());
    let minutes = this.zeroNumber(date.getMinutes());
    let seconds = this.zeroNumber(date.getSeconds());

    return `${hour}:${minutes}:${seconds}`;
}

function zeroNumber(number){
    if(number < 10){
        return "0"+number;
    }

    return number;
}

function appendLi(msg, classes, img, timer) {
    var item = document.createElement("li");
    item.textContent = msg;
    item.dataset.timestamp = this.timestampToCleanTime(timer);

    for (let cls in classes) {
        item.classList.add(classes);
    }

    if (img) {
        var image = document.createElement("img");
        image.src = img;

        item.appendChild(image);
    }

    messages.appendChild(item);
    item.scrollIntoView();
}

socket.on("_handleChat", function ({msg,user}) {
    console.log(msg.msg);
    appendLi(msg.msg, ["self"], user.imgUrl,msg.timestamp);
});

socket.on("logged", function ({user,timer,selectedRoom}) {
    let msg = `${user.pseudo} s'est connecté !`;
    appendLi(msg, [], user.imgUrl,timer);
    formLogIn.replaceWith(form);
    selectedRoom = selectedRoom;
});

socket.on('initRooms',function(rooms){

    let roomsElement = document.getElementsByClassName('list-rooms');

    let count = 0;

    for(let room in rooms._rooms) {
        let roomElement = document.createElement('div');
        roomElement.classList.add('room-content');
        roomElement.id = room;

        if(count === 0){
            roomElement.classList.add('selected');
            selectedRoom = room;
        }

        let src= rooms._rooms[room].urlImage;

        let img = document.createElement('img');
        img.src = src ? src : "default-image.jpg";

        roomElement.addEventListener('click',function(){
            document.querySelector('.room.selected').classList.remove('selected');
            roomElement.classList.add('selected');
            selectedRoom = roomElement.id;

            socket.emit('chooseRoom',selectedRoom);

        })

        roomElement.innerHTML = "<div class=\"col-img\">" +
            "<img src=" + img.src + ">" +
            "</div>" +
            "<div class=\"col-right\">" +
            "<p class=\"title-room\">" + rooms._rooms[room].title + "</p>" +
            "<p class=\"date\">09:55</p>" +
            "</div>";

        console.log(roomsElement);

        roomElement.appendChild(roomsElement);

        count++;
    }
})

socket.on('initUsers',(users)=>{

    let usersElement = document.getElementsByClassName('list-users');
    usersElement.innerHTML = "";

    for(let user of users){

        if(!document.getElementById(user.id)){
            let userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.id = user.id;

            let img = document.createElement('img');
            img.src = user.imgUrl ? user.imgUrl : "default-image.jpg";

            let p = document.createElement('p');
            p.textContent = user.pseudo;

            userElement.appendChild(img);
            userElement.appendChild(p);

            usersElement.appendChild(userElement);
        }

    }
})