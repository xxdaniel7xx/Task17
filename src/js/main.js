//TASK 2
const changeBtn = document.getElementById('changeBtn');
let ico1 = document.getElementById('ico1');
let ico2 = document.getElementById('ico2');

let arr = [ico1, ico2]

changeBtn.addEventListener('click', () => {
    arr[0].hidden = true;
    arr[1].hidden = false;
    arr.push(arr[0]);
    arr.shift();


})

//TASK 3 & 4

const btn2 = document.getElementById('btn2');
const scrnSize = document.getElementById('scrnSize');
const coords = document.getElementById('coords');
const time= document.getElementById('time')


btn2.addEventListener('click', () => {

    //Screen size of user
    scrnSize.innerHTML = `Ширина экрана - ${document.documentElement.clientWidth}. Высота экрана - ${document.documentElement.clientHeight}`

    //Geo position of user
    async function success(position) {
        let latitude  = position.coords.latitude;
        let longitude = position.coords.longitude;
        console.log(latitude, longitude)
        let a = document.createElement('a')
        coords.appendChild(a)
        coords.firstChild.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        coords.firstChild.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
        fetch(`https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=${latitude}&long=${longitude}`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                time.innerHTML = `Временная зона: +${data.timezone_offset}, ${data.timezone}. Местные дата и время: ${data.date_time_txt}`
                return data
            })

    }

    if (!navigator.geolocation) {
        coords.innerHTML = 'Информация о местоположении недоступна';
    } else {
        navigator.geolocation.getCurrentPosition(success);
    }
})

//TASK 5

const chatWindow = document.getElementById('chatWindow');
const inputField = document.getElementById('inputField');
const sendBtn = document.getElementById('sendBtn')
const geoBtn = document.getElementById('geoBtn');
const clearBtn = document.getElementById('clearBtn')

const wsUrl = 'wss://echo.websocket.org/';



function sendMessage(message) {
    if (message.indexOf('Сервер') == 0) {

    }
    let p = document.createElement('p');
    if (message.indexOf('Сервер') == 0) {
        p.classList.add('server')
    } else {
        p.classList.add('client')
    }
    p.innerHTML = message;
    chatWindow.appendChild(p);
}

//Send btn
sendBtn.addEventListener('click', () => {

    let message = inputField.value;
    if (message == '') {

        alert('Введите сообщение!')

    } else {
        sendMessage(message)
        let wsPromise = new Promise((resolve, reject) => {
            let websocket = new WebSocket(wsUrl);
            resolve(websocket)
        })
        wsPromise.then((websocket) => {

            websocket.onopen = function(evt) {
                console.log('CONNECTED');
                websocket.send(message);
            }
            websocket.onerror = function(evt) {
                console.warn('ERROR' + evt.data)
            }

            websocket.onmessage = function(evt) {
                console.log(evt.data);
                sendMessage('Сервер: ' + evt.data)
            }
            setTimeout(websocket.send(message),100)
            websocket.close()
            websocket = null
        })
        inputField.value = '';
    }
})

//geo btn
geoBtn.addEventListener('click', () => {
    function success3(pos) {
        let p = document.createElement('p');
        let a = document.createElement('a');
        let latitude  = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        chatWindow.appendChild(p)
        p.classList.add('client');
        chatWindow.lastChild.appendChild(a)
        chatWindow.lastChild.firstChild.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        chatWindow.lastChild.firstChild.textContent = 'Моё место положение'
    }
    navigator.geolocation.getCurrentPosition(success3);
})

//clear btn

clearBtn.addEventListener('click', () => {
    while (chatWindow.firstChild) {
        chatWindow.removeChild(chatWindow.firstChild);
    }
})

