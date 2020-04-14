// load channels form modal
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#addChannels').onclick = () => {

        $('#modalChannelsForm').modal();

    }
});


document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, send message
    socket.on('connect', () => {
        
        // event listener for on submit
        document.querySelector('#channelsForm').onsubmit = () => {
                const channelName = document.querySelector('#channelName').value;

                for (cName of channelNames)
                {
                    if (channelName === cName.getAttribute('value'))
                    {
                        //if channel already exists then
                        alert("Channel name already taken, try another!");
                        return false;
                    }
                }

                localStorage.setItem('channelName', channelName);
                socket.emit("add channel", {"c_name": channelName});
            }

    });

    // When a new channel has been added, display it to user
    socket.on('show channel', data => {

        if (data.response === true)
        {
            const cNames = document.querySelector('#channelNames');
            const paraElem = document.createElement("p");
            paraElem.id = "channelNaam";
            paraElem.setAttribute("value", data.cName);
            paraElem.innerHTML = `#${data.cName}`;

            // creator of the channel will be switched to new channel he just created
            if (data.cName === localStorage.getItem('channelName'))
            {
                paraElem.className = "card-text p-1 bg-secondary rounded";

                // update selected channel
                if (selChannel)
                {
                    selChannel.className = "card-text";
                }
                selChannel = paraElem;

                // hide modal
                $('#modalChannelsForm').modal('hide');

                // fetch the right messages for the active channel
                getMessages();
            }
            // for others the channels will just get added to the list
            else
            {
                paraElem.className = "card-text";
            }
            cNames.appendChild(paraElem);
            // need to done for all
            channelNames = document.querySelectorAll('#channelNaam');
        }
        else
        {
            //if channel already exists then
            alert("Channel name already taken, try another!");
        }

    });
});
