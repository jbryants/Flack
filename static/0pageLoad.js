// Template to set or push messages
const template = Handlebars.compile(document.querySelector('#messagesHbars').innerHTML);

// Fetch all existing messages and display them.
function getMessages(sCount=0) {
    
    // Add data to send with request
    const channelName = localStorage.getItem('channelName');

    // Initialize a new request
    const request = new XMLHttpRequest();
    request.open('GET', '/get_messages/' + channelName + '/' + sCount);

    // send request
    request.send();
    
    // Callback function when request completes
    request.onload = () => {

        const resData = JSON.parse(request.responseText);    
        console.log(resData);
        
        const content = template(resData.messages);

        if (sCount == 0)
        {
            document.querySelector('#messages').innerHTML = content;
            scrollCount.set(localStorage.channelName, {val: 0});
        }
        else
        {
            document.querySelector('#messages').innerHTML += content;
        }
    }

    // return false if unable to send request.
    return false;
}


let selChannel = null;
let channelNames = document.querySelectorAll('#channelNaam');

// Setting the active channel on start of app.
function setActiveChannel()
{
    const cName = localStorage.getItem('channelName');
    try 
    {
        if (cName)
        {
            // select it and fetch messages for it
            const actChannel = document.querySelector(`p[value=${cName}]`);
            actChannel.className = "card-text p-1 bg-secondary rounded";
            selChannel = actChannel;
        }
        else
        {
            // else select first item from list and fetch messages for it
            actChannel = document.querySelector('#channelNaam');
            actChannel.className = "card-text p-1 bg-secondary rounded";
            selChannel = actChannel;
            localStorage.setItem('channelName', actChannel.getAttribute('value'));
        }

        getMessages();
    }
    catch (err)
    {
        // Exception handling when no channels are present.
    }
}


// Function to load display name modal on initial visit to website
$(window).on('load',function(){
    if (!localStorage.getItem('dispName'))
    {
        $('#modalDispName').modal();
    }
    else
    {
        $('#modalDispName').modal('dispose');
    }
    setActiveChannel();
});


// handle display name form submission
document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#dname_form').onsubmit = function() {

        // get input display name and add it to localStorage to be remembered.
        const name = document.querySelector('#inputName').value;
        localStorage.setItem('dispName', name);

        // dipose off display name on successful submission of form.
        $('#modalDispName').modal('dispose');

    };
});
