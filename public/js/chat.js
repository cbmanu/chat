const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const button = document.getElementById('button');
const messages = document.getElementById('messages');
const geolocation = document.getElementById('geolocation');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    button.setAttribute('disabled','disabled')
    if (input.value) {
        socket.emit('chat message', input.value,(callback) => {
            console.log(callback)
        })
        input.value = '';
        button.removeAttribute('disabled')
        input.focus()
        
    }

});



socket.on('greetings', (greeting) => {
    console.log(greeting);
})
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

geolocation.addEventListener('click', (e) => {
    e.preventDefault();
    geolocation.setAttribute('disabled','disabled')
    if (!navigator.geolocation) {
        return alert("Your browser does not support geolocation!")
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('geolocation', {
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },(response)=>{
                geolocation.removeAttribute('disabled')
                console.log(response)
            });
        });
    }
});


socket.on('geolocation', (geolocation) => {
    const item = document.createElement('a');
    item.textContent = "My location:)";
    item.href=geolocation
    item.target="_blank"
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})