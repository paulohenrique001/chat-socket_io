var socket = io();

function getId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function renderMessage(message) {
    const authorChat = $('#idUser').val();
    if (message.id !== idChat) {
        $('.messages').append('<div class="msg-outher" style="background-color: ' + message.colorChat + ';"><strong>' + message.author + '</strong>: ' + message.message + '</div>');
    } else {
        $('.messages').append('<div class="msg-author" style="background-color: ' + message.colorChat + ';">' + message.message + '</div>');
    }
}

const months = [
    "#ff9933", //Laranja
    "#33cc33", //Verde
    "#ff00ff", //Rosa
    "#669999", //Azul Escuro
    "#6600ff", //Roxo
    "#0000ff", //Azul Forte
    "#ff5050", //Vermelho
    "#336600" //Verde Soldado
];

const random = Math.floor(Math.random() * months.length);

const idChat = getId();
const colorChat = months[random];
console.log(colorChat);

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
    const handleGetId = idChat;

    if (handleGetId === '') {
        const idTemp = getId();
        idChat = idTemp;
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
            colorChat: colorChat,
            message: message,
        };

        renderMessage(messageObject);
        $('#msgInput').val("");
        const chatHeight = $('.messages')[0].scrollHeight;
        $('div.messages').scrollTop(chatHeight)

        socket.emit('sendMessage', messageObject);
    }
});