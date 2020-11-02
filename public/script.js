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
        $('.messages').append('<div class="message m-outher" style="background-color: '+ message.colorChat +';"><img class="avata a-outher" src="'+ message.photo +'" alt="Avatar"><span class="nome">'+ message.author +'</span><br><p>'+ message.message +'</p><span class="time t-left">'+ message.hora +'</span></div>');
    } else {
        $('.messages').append('<div class="message" style="background-color: '+ message.colorChat +';"><img class="avata" src="'+ message.photo +'" alt="Avatar"><p>'+ message.message +'</p><span class="time">'+ message.hora +'</span></div>');
    }
}

const months = [
    "#7d0bda", //Roxo
    "#226d3b", //Verde
    "#da0b61", //Tomato
    "#0b4cda", //Azul
    "#4cda0b", //Verde Limão
    "#da4c0b", //Laranja
    "#7d0bda", //Roxo
    "#226d3b", //Verde
    "#da0b61", //Tomato
    "#0b4cda", //Azul
    "#4cda0b", //Verde Limão
    "#da4c0b", //Laranja
    "#7d0bda", //Roxo
    "#226d3b", //Verde
    "#da0b61", //Tomato
    "#0b4cda", //Azul
    "#4cda0b", //Verde Limão
    "#da4c0b"  //Laranja
];
const randomColor = Math.floor(Math.random() * months.length);

const avatar = [
    "https://www.pngarts.com/files/3/Avatar-Transparent-Image.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ-5ZhY_zF7rfvVU4DC7fUX015ldfE4X-VQwQ&usqp=CAU",
    "https://avatarfiles.alphacoders.com/791/79102.png",
    "https://cdn1.valuegaia.com.br/gaiasite/641/media/e6ac677fdb241210d1995afb4cd1505c-avatar-icon-png-8.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQWPT18DLARd7MTr_EMfyszJNj8h-itSNaTfw&usqp=CAU"

];
const randomPhoto = Math.floor(Math.random() * avatar.length);

const colorChat = months[randomColor];
const photoChat = avatar[randomPhoto];
const idChat = getId();


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

    const author = $('input[name=username]').val();
    const message = $('input[name=message]').val();
    const data = new Date();
    const hora = data.getHours() + ':' + data.getMinutes();

    if (author.length && message.length) {
        var messageObject = {
            id: handleGetId,
            author: author,
            photo: photoChat,
            colorChat: colorChat,
            message: message,
            hora: hora
        };

        renderMessage(messageObject);
        $('#msgInput').val("");
        $('#msgInput').focus();
        const chatHeight = $('.messages')[0].scrollHeight;
        $('div.messages').scrollTop(chatHeight);
        $('#msgAuthor').css({display: 'none'});

        socket.emit('sendMessage', messageObject);
    }
});