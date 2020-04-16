// time formatter
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, send message
    socket.on('connect', () => {
        
        const name = localStorage.getItem('dispName');

        // event listener for send button click
        document.querySelector('#msgToSendBtn').onclick = () => {
            
            let messageElem = document.querySelector('#msgToSend');

            const channelName = localStorage.getItem('channelName');
            const time = formatAMPM(new Date);
            const message = messageElem.value;
            
            // reset the value of input textbox to empty
            messageElem.value = "";

            // send the message across
            socket.emit('append message',
                {'c_name': channelName, 'name': name, 'time': time, 'message': message});
        };

        // event listener on return click
        document.querySelector('#msgToSend').addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();

                let messageElem = document.querySelector('#msgToSend');

                const channelName = localStorage.getItem('channelName');
                const time = formatAMPM(new Date);
                const message = messageElem.value;

                // reset the value of input textbox to empty
                messageElem.value = "";

                socket.emit('append message',
                    {'c_name': channelName, 'name': name, 'time': time, 'message': message});
            }
        });
    })

    // When a new message has been announced, add to the messages
    socket.on('show message', data => {

        // if user is currently on this channel
        if (data.c_name === localStorage.getItem('channelName'))
        {
            const content = template([{'name': data.name, 'time': data.time, 'message': data.message}]);
            messages =  document.querySelector('#messages');
            messages.innerHTML = content + messages.innerHTML;
        }
    })
});
