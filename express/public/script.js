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
input.placeholder = "Enter message";

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
    appendLi(msg.msg, ["self"], user.imgUrl,msg.timestamp);
});

socket.on("logged", function ({user,timer,selectedRoom}) {
    let msg = `${user.pseudo} s'est connecté !`;
    appendLi(msg, [], user.imgUrl,timer);
    formLogIn.replaceWith(form);
    selectedRoom = selectedRoom;
});

socket.on('initRooms',function(rooms){

    let count = 0;

    for(let room of rooms) {

        let roomContent = document.createElement('div');
        roomContent.classList.add('room-content');
        roomContent.id = room;

        if(count === 0){
            roomContent.classList.add('selected');
            selectedRoom = room;
        }

        let src= rooms.urlImage;

        let img = document.createElement('img');
        img.src = src ? src : "default-image.jpg";

        roomContent.innerHTML = "<div class=\"col-img\">" +
            "<img src=" + img.src + ">" +
            "</div>" +
            "<div class=\"col-right\">" +
            "<p class=\"title-room\">" + room.title + "</p>" +
            "<p class=\"date\">09:55</p>" +
            "</div>";

        document.querySelector(".list-rooms").appendChild(roomContent);

        roomContent.addEventListener('click',function(){
            document.querySelector('.room-content.selected').classList.remove('selected');
            roomContent.classList.add('selected');
            selectedRoom = roomContent.id;

            socket.emit('chooseRoom',selectedRoom);

        })

        count++;
    }
})

socket.on('initUsers',(users)=>{

    let usersElement = document.getElementsByClassName('list-users');
    usersElement.innerHTML = "";

    for(let user of users){

        if(!document.getElementById(user.id)){
            let userElement = document.createElement('div');
            userElement.classList.add('user-content');
            userElement.id = user.id;

            let img = document.createElement('img');
            img.src = user.imgUrl ? user.imgUrl : "default-image.jpg";

            userElement.innerHTML = "<div class=\"col-img\">" +
                "<img src=" + img.src + ">" +
                "</div>" +
                "<div class=\"col-right\">" +
                "<p class=\"user-name\">" + user.pseudo + "</p>" +
                "</div>";

            document.querySelector(".list-users").appendChild(userElement);
        }

    }
})