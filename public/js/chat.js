const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const button = document.getElementById('button');
const messages = document.getElementById('messages');
const geolocation = document.getElementById('geolocation');
const roomTitle = document.getElementById('room')
const usersList = document.getElementById('usersList')

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    button.setAttribute('disabled','disabled')
    if (input.value) {
        socket.emit('user message', input.value,(callback) => {
            console.log(callback)
        })
    }
    input.value = '';
    button.removeAttribute('disabled')
    input.focus()
});

socket.on('chat message', (msg,name) => {
    const item = document.createElement('p');
    const small=document.createElement('small');
    item.textContent = msg.text+" ";
    small.textContent = moment(msg.createdAt).format('LT');
    item.appendChild(small)
    messages.appendChild(item);
});

socket.on('user message', (msg,name) => {
    const container = document.createElement('div');
    const item = document.createElement('p');
    const small=document.createElement('small');
    const h6=document.createElement('h6');
    h6.textContent=name;
    item.textContent = msg.text+" ";
    small.textContent = moment(msg.createdAt).format('LT');
    item.appendChild(small)
    messages.appendChild(item);
    container.appendChild(h6)
    container.appendChild(item);
    messages.appendChild(container)
});

geolocation.addEventListener('click', (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert("Your browser does not support geolocation!")
    } else {
        geolocation.setAttribute('disabled','disabled')
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


socket.on('geolocation', (geolocation,name) => {
    const item = document.createElement('a');
    const container = document.createElement('div');
    const small=document.createElement('small');
    const h6=document.createElement('h6');
    
    h6.textContent=name;
    item.textContent = "My location:) ";
    item.href=geolocation.text
    small.textContent = moment(geolocation.createdAt).format('LT');
    item.target="_blank"
    item.appendChild(small);
    container.appendChild(h6)
    container.appendChild(item);
    messages.appendChild(container)
    window.scrollTo(0, document.body.scrollHeight);
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
})
socket.on('room data',({room,users})=>{
    showUsersList(users)

})
const showUsersList=(users,i)=> {
    usersList.textContent=''
    if(users){
        roomTitle.textContent=`Users in ${room}`
        users.forEach(user => {
            const img=document.createElement('img');
            const span=document.createElement('span');
            const br=document.createElement('br')
            img.height=32;
            img.width=32;
            img.src='/img/greenCircle.png';
            usersList.appendChild(img);
            span.textContent=`${user.username}`
            usersList.appendChild(span)
            usersList.appendChild(br)
        })
    }
    
}