const newBtn = document.getElementById("btnBezhuini");
const chatBtn = document.querySelector("#chatBtn");
const chatInput = document.querySelector("#chatInput");
let loginIO = "";
const chatArea = document.querySelector("#chatArea");
const allchatusersArea = document.querySelector('#allchatusers');
const chatBox = document.querySelector('#chatBox');

function chatInputResize() {
  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    let offset = element.offsetHeight - element.clientHeight;
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
    });
    element.removeAttribute('data-autoresize');
  });
}

function sendConnectMessage() {
    socket.emit("chat message", {
        message: 'systemConnectionCheckBIBA',
        login: loginIO
      });
}

function getSingleUserChat() {
    const allUserBtns = document.querySelectorAll('.allchatusers__item');
    allUserBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            loginIO = btn.getAttribute('name');
            sendConnectMessage();
            clearMessages();
            renderRecentMessages(loginIO);
        })
    })
}

function clearMessages() {
    const chatArea = document.querySelector('#chatArea');
    const allMessages = document.querySelectorAll('.messageItem');
    allMessages.forEach(message => {
        message.remove();
    })

}

function getAllUsers() {
    axios.get('https://stark-chamber-40248.herokuapp.com/getAllUsers')
    .then(function (res) {
        const allUsersArr = res.data.allUsersArr;
        allUsersArr.forEach(item => {
            const element = document.createElement('div');
            element.setAttribute('class', 'allchatusers__item');
            element.setAttribute('name', item);
            element.innerHTML = `
            <div class="allchatusers__logo">
                <img class="allchatusers__logo-img" src="../img/adminBiba/hacker.png" alt="">
            </div>
            <div class="allchatusers__name">${item}</div>
            
            `

            allchatusersArea.append(element);
        });

        getSingleUserChat();

    })
    .catch(function (error) {
        alert(error);
    })
}

function renderRecentMessages(login) {
    axios
    .post("https://stark-chamber-40248.herokuapp.com/renderRecentMessages", {
      login: `${login}chats`
    })
    .then(function (res) {
        console.log(res.data)
        res.data.messages.reverse();
        let arrLength;
        if(res.data.messages.length >= 200) {
            arrLength = 200
        } else {
            arrLength = res.data.messages.length;
        }
      for(let i = arrLength - 1; i >= 0; i--) {
          const x = res.data.messages[i];
          renderMessage(x.sender, x.date, x.message);
          chatArea.scrollBy(0, 150);
      }
      
    })
    .catch(function (error) {
      alert(error);
    });
}

function decodeJwt() {
  axios
    .post("https://stark-chamber-40248.herokuapp.com/decodejwt", {
      token: localStorage.getItem("token"),
    })
    .then(function (res) {
      
      loginIO = res.data.login;
      getAllUsers();
      renderRecentMessages(res.data.login);
      socket.on('chat message', async function (data) {
        console.log(data);
        await renderMessage(data.sender, data.date, data.message);
        console.log(loginIO);
        chatArea.scrollBy(0, 150);
      });
    })
    .catch(function (error) {
      alert(error);
    });
}


function renderMessage(name, date, message) {

  let messageItem = document.createElement("div");
  messageItem.setAttribute("class", "messageItem");

  messageItem.innerHTML = `
    
    <div class="messageItem__container">
        <div class="messageItem__avatar">
            <img class="messageItem__avatar-img" src="../img/biba/profile.png" alt="">
        </div>
        <div class="messageItem__content">
            <div class="messagItem__info">
                <div class="messageItem__name">${name}</div>
                <div class="messageItem__date">${date}</div>
            </div>
            <div class="messageItem__text">${message}</div>
        </div>
    </div>
    `;

  chatArea.append(messageItem);
  messageItem = "";
}

axios
  .post("https://stark-chamber-40248.herokuapp.com/checkjwt", {
    token: localStorage.getItem("token"),
  })
  .then(function (res) {
    if (res.data.message) {
      location.href = "../signin/signin.html";
    } else {
      decodeJwt();
    }
  })
  .catch(function (error) {
    alert(error);
  });




const socket = io("https://stark-chamber-40248.herokuapp.com");

chatBtn.addEventListener("click",  (e) => {
  if (chatInput.value) {
     socket.emit("chat message", {
      message: chatInput.value,
      login: loginIO,
      admin: 'admin'
    });
    chatInput.value = "";
  }
});

document.addEventListener('keydown', (e) => {

  if(e.code === 'Enter') {
      e.preventDefault();
        
    if(chatInput.value) {
        socket.emit("chat message", {
            message: chatInput.value,
            login: loginIO,
            admin: 'admin'
          });
          chatInput.value = "";
       
          e.preventDefault();
    }
  }
})

chatInput.addEventListener('keyup', (event) => {
  chatInputResize(event, 15, 2);
})