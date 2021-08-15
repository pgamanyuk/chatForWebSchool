
window.addEventListener('DOMContentLoaded', () => {

    const mail = document.querySelector('#mail');
    const login = document.querySelector('#login');
    const pass = document.querySelector('#pass');
    const confirm = document.querySelector('#confirmPass');
    const btnSend = document.querySelector('#btnSend');

    localStorage.setItem('test', 1);
    


    btnSend.addEventListener('click', (e) => {
        e.preventDefault();

        const mailValue = mail.value;
        const loginValue = login.value;
        const passValue = pass.value;
        const confirmValue = confirm.value;
        
        if(/@/.test(mailValue) && /\./.test(mailValue) && passValue === confirmValue && loginValue) {
            axios.post('https://stark-chamber-40248.herokuapp.com/signup', {
                mail: mailValue,
                password: passValue,
                login: loginValue
              })
              .then(function (res) {
                localStorage.setItem('token', res.data.token);
                location.href = '../biba/biba.html';
              })
              .catch(function (error) {
                alert('Pizdariki')
              });
        }
    })
})