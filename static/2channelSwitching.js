// Handling switching between channels
document.querySelector('#channelNames').onclick = () => {

    channelNames.forEach(function(channelName) {

                channelName.onclick = () => {
                if (selChannel)
                {
                    selChannel.className = "card-text";
                }
                
                channelName.className = "card-text p-1 bg-secondary rounded";
                selChannel = channelName;

                // remembering which channel is currently active
                localStorage.setItem('channelName', channelName.getAttribute('value'));
                
                // fetch the right messages for the active channel
                getMessages();
            }
            
        }
    );
}