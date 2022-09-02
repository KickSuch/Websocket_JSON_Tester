let socket = null;
const output = document.querySelector('#output');

function scroll_output_to_bottom() {
    const output = document.querySelector('#output');
    output.scrollTop = output.scrollHeight;
}

// socket event actions
function socket_ononopen(event) {
    output.innerHTML += 'Successfully connected!\n\n';
    scroll_output_to_bottom();
}
function socket_onmessage(event) {
    output.innerHTML += 'socket_onmessage:\n';
    let data = JSON.parse(event.data);
    output.innerHTML += JSON.stringify(data, null, 4);
    output.innerHTML += '\n\n';
    scroll_output_to_bottom();
}
function socket_onerror(event) {
    output.innerHTML += 'socket_onerror:\n';
    output.innerHTML += event;
    output.innerHTML += '\n\n';
    scroll_output_to_bottom();
    console.log(event);
}
function socket_onclose(event) {
    output.innerHTML += 'socket_onclose:\n';
    output.innerHTML += event;
    output.innerHTML += '\n\n';
    scroll_output_to_bottom();
    console.log(event);
    socket = null;
}

// when you click CONNECT btn
document.querySelector('#connect_btn').onclick = function(event) {
    const websocket_url = document.querySelector('#websocket_url').value;

    if (socket != null) { // silently closes the previous socket
        socket.onclose = null;
        socket.close();
    }
    output.innerHTML += 'Connecting to ' + websocket_url + '\n'
    try {
        socket = new WebSocket(websocket_url);
        // passing on the socket functions
        socket.onopen = socket_ononopen;
        socket.onmessage = socket_onmessage;
        socket.onerror = socket_onerror;
        socket.onclose = socket_onclose;
    } catch (error) {
        socket = null;
        output.innerHTML += error;
    }
    scroll_output_to_bottom();
}

// when you click SEND btn
document.querySelector('#send_btn').onclick = function(event) {
    if (socket == null) {
        alert('First you need to connect to a socket!');
        return;
    }
    if (socket.readyState == WebSocket.CONNECTING) {
        alert('Socket is still connecting!');
        return;
    }
    const input = document.querySelector('#input').value;
    try {
        let json = JSON.parse(input);
        socket.send(JSON.stringify(json));
    } catch (error) {
        output.innerHTML += error + "\n\n";
        scroll_output_to_bottom();
    }
}
