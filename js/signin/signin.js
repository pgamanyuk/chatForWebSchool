window.addEventListener("DOMContentLoaded", () => {
  const mailOrLogin = document.querySelector("#mail");
  const pass = document.querySelector("#pass");
  const btnSend = document.querySelector("#btnSend");

  btnSend.addEventListener("click", (e) => {
    e.preventDefault();

    const mailOrLoginValue = mailOrLogin.value;
    const passValue = pass.value;

    axios
      .post("https://stark-chamber-40248.herokuapp.com/signin", {
        mailOrLogin: mailOrLoginValue,
        password: passValue,
      })
      .then(function (res) {
        localStorage.setItem('token', res.data.token);
       if(res.data.admin === 'yes') {
        location.href = '../adminBiba/adminBiba.html'
       } else {
        location.href = '../biba/biba.html'
       }
        
      })
      .catch(function (error) {
        alert("Pizdariki");
      });
  });
});
