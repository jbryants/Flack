// map to keep track of counts of scrolls - used for pagination
let scrollCount = new Map();

let threshold = false;
var lastScrollTop = 0;
$('#messages').scroll(function() {

    var pos = $('#messages').scrollTop();
    
    if (pos < lastScrollTop)
    {
        scrollPercent = Math.floor((pos / document.querySelector('#messages').scrollHeight) * 100);
        if (scrollPercent <= 5) {

            console.log(scrollCount.get(localStorage.channelName));
            scrollCount.get(localStorage.channelName).val++;
            getMessages(sCount=scrollCount.get(localStorage.channelName).val);
            console.log(scrollCount.get(localStorage.channelName));

            if (scrollCount.get(localStorage.channelName) <= 4)
            {
                document.querySelector('#messages').scrollTop += 50;
            }
        }
    }

    lastScrollTop = document.querySelector('#messages').scrollTop;
});