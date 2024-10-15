const socket = io();
// const socket = io('https://matyuninger.vercel.app');

const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const joinButton = document.getElementById('join');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('message-list');

joinButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit('set username', username);
        loginDiv.style.display = 'none';
        chatDiv.style.display = 'flex';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const item = document.createElement('li');

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    usernameElement.textContent = data.user;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message-text');
    messageElement.textContent = data.text;

    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.textContent = data.time;

    item.appendChild(usernameElement);
    item.appendChild(messageElement);
    item.appendChild(timeElement);

    if (data.user === usernameInput.value.trim()) {
        item.classList.add('my-message');
    } else {
        item.classList.add('other-message');
    }

    messages.appendChild(item);
    messages.parentElement.scrollTop = messages.parentElement.scrollHeight;
});

socket.on('user connected', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    item.style.fontStyle = 'italic';
    messages.prepend(item);
});

socket.on('user disconnected', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    item.style.fontStyle = 'italic';
    messages.prepend(item);
});
