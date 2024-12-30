//-------------------------------constants-------------------------------
const signupBox = document.querySelector(".signupBox");
const signupBtn = document.querySelector(".signupBtn");
const alreadyHaveAccount = document.querySelector(".account");
const loginBox = document.querySelector(".loginBox");
const loginBtn = document.querySelector(".loginBtn");
const pageForm=document.querySelector(".page");
const pageAccueil=document.querySelector(".pageAccueil");
let token=null
const inputRegister=document.querySelector(".inputRegister");
inputRegister.value=""
const inputLogin=document.querySelector(".inputLogin");
inputLogin.value=""




//-------------------------------functions-------------------------------
async function login(loginUsernameInput,loginPasswordInput) {
    let paramsLogin={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: loginUsernameInput.value,
            password: loginPasswordInput.value,
        })
    }
    return await fetch("https://b1messenger.esdlyon.dev/login", paramsLogin)
        .then(response => response.json())
        .then((data) => {
            return data.token
        })
}

function testToken(token) {
    if (!(token===null||token===undefined)) {
        return true
    }
}
//-------------------------------addEvent-------------------------------

//-->display loginBox
alreadyHaveAccount.addEventListener("click", () => {
    signupBox.style.display = "none";
    loginBox.style.display = "flex";
})

//-->Register
signupBtn.addEventListener("click", () => {
    const signupUsernameInput = document.querySelector(".signupUsernameInput");
    const signupPasswordInput = document.querySelector(".signupPasswordInput");
    let paramsRegister={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: signupUsernameInput.value,
            password: signupPasswordInput.value,
        })
    }
    fetch("https://b1messenger.esdlyon.dev/register", paramsRegister)
    .then(response => response.json())
    .then(data => {
        //console.log(data);--> ok
        signupBox.style.display = "none";
        loginBox.style.display = "flex";
    })
})

loginBtn.addEventListener("click", () => {
    let loginUsernameInput = document.querySelector(".loginUsernameInput");
    let loginPasswordInput = document.querySelector(".loginPasswordInput");
    login(loginUsernameInput,loginPasswordInput)
        .then((response) => {
            token=response;
            if(testToken(token)){
                pageForm.style.display = "none";
                pageAccueil.style.display = "flex";
            }
        })
})