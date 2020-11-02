var socket = io();

function getId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function renderMessage(message) {
    const authorChat = $('#idUser').val();
    if (message.id !== chatId) {
        $('.messages').append('<div class="msg-outher"><strong>' + message.author + '</strong>: ' + message.message + '</div>');
    } else {
        $('.messages').append('<div class="msg-author">' + message.message + '</div>');
    }
}

const chatId = getId();

socket.on('previousMessages', function (messages) {
    for (message of messages) {
        renderMessage(message);
        const chatHeight = $('.messages')[0].scrollHeight;
        $('div.messages').scrollTop(chatHeight)
    }
});

socket.on('receivedMessage', function (message) {
    renderMessage(message);

    const chatHeight = $('.messages')[0].scrollHeight;
    $('div.messages').scrollTop(chatHeight)
});

$('.chat').submit(function (event) {
    event.preventDefault();
    const handleGetId = chatId;

    if (handleGetId === '') {
        const idTemp = getId();
        chatId = idTemp;
        handleGetId = idTemp;
    } else {
        console.log('HandleGetId: OK');
    }


    var author = $('input[name=username]').val();
    var message = $('input[name=message]').val();

    if (author.length && message.length) {
        var messageObject = {
            id: handleGetId,
            author: author,
            message: message,
        };

        renderMessage(messageObject);
        $('#msgInput').val("");
        const chatHeight = $('.messages')[0].scrollHeight;
        $('div.messages').scrollTop(chatHeight)

        socket.emit('sendMessage', messageObject);
    }
});