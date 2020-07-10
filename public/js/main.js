const socket = io();

const chatForm = document.getElementById("chatForm");
const messagesContainer = document.getElementById("messagesContainer");
const ofContainer = document.getElementById("of-container");
const roomName = document.getElementById("roomName");
const usersList = document.getElementById("usersList");

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

socket.on('message', (message) => {
    addMessage(message);
    ofContainer.scrollTop = ofContainer.scrollHeight;
});

socket.on('roomUsers', ({room, users}) => {
    updateRoomName(room);
    updateUsersList(users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    if(msg !== ""){
        e.target.elements.msg.value = "";
        socket.emit('chatMessage', msg);
    }else{
        UIkit.notification({
            message: "<div class='uk-border-rounded'><span uk-icon='icon: warning'></span> Please enter message to send.</div>",
            status: 'warning',
            pos: 'top-right',
            timeout: 3000
        });
    }
    e.target.elements.msg.focus();
});

function addMessage(message) {
    const div = document.createElement('div');
    div.className = "uk-card-primary uk-border-rounded uk-padding-small uk-margin-small uk-width-large";
    div.innerHTML = `<p class="uk-text-bold" style="color: white; margin: 0;">${message.user} ${message.time}</p>
    <p style="word-break: break-all; margin: 0;color: white;">${message.text}</p>`;

    messagesContainer.appendChild(div);
}

function updateRoomName(name){
    roomName.innerHTML = name;
}

function updateUsersList(users){
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.name}</li>`).join("")}
    `;
}

function leave(){
    socket.close();
    window.location = "/";
}