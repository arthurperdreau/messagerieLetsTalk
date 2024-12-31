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

const pageChat=document.querySelector(".pageChat");
let boxChat=document.querySelector(".boxChat");


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


async function arrayAllUsersUsername(){
    let paramsAllUsersUsername={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    return await fetch("https://b1messenger.esdlyon.dev/api/messages",paramsAllUsersUsername)
        .then(response => response.json())
        .then(data => {
            //console.log("reponse allUsers:",data)
            let allUsersUsername=[]
            data.forEach(element => {
                if(!(allUsersUsername.includes(element.author.username)) ){
                    allUsersUsername.push(element.author.username)
                }
            })

            return allUsersUsername
        })
}
async function arrayAllUsersId(){
    let paramsAllUsers={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    return await fetch("https://b1messenger.esdlyon.dev/api/messages",paramsAllUsers)
    .then(response => response.json())
    .then(data => {
        //console.log("reponse allUsers:",data)
        let allUsersId=[]
        data.forEach(element => {
            if(!(allUsersId.includes(element.author.id)) ){
                allUsersId.push(element.author.id)
                //console.log(allUsers)
            }
        })

        return allUsersId
    })
}
async function arrayAllUsersImage(){
    let paramsAllUsersImage={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    return await fetch("https://b1messenger.esdlyon.dev/api/messages",paramsAllUsersImage)
        .then(response => response.json())
        .then(data => {
            //console.log("reponse allUsers:",data)
            let idUser=[]
            let allUsersImage=[]
            data.forEach(element => {
                if(element.author.image===null && !(idUser.includes(element.author.id))){
                    allUsersImage.push("images/noneProfilePicture.jpg")
                }else{
                    if(!(allUsersImage.includes(element.author.image.imageName))){
                        allUsersImage.push(element.author.image.imageName)
                    }

                }
                if(!(idUser.includes(element.author.id)) ){
                    idUser.push(element.author.id)
                }

            })

            return allUsersImage
        })
}

function displayMessages(idUser){
    let authorization={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    console.log("ici c bon")
    fetch(`https://b1messenger.esdlyon.dev/api/private/conversation/${idUser}`, authorization)
    .then(response => response.json())
    .then(data => {
        console.log("je suis dans le fetch")
        let conversation=data.privateMessages
        if(!(conversation===undefined)){
            conversation.forEach(element => {
                if(element.author.id===idUser){
                    let divMessage=document.createElement("div");
                    divMessage.classList.add("divPrivateMessage")
                    let message=document.createElement("span");
                    message.classList.add("messageOfFriend");
                    message.innerHTML=element.content;
                    divMessage.appendChild(message);
                    boxChat.appendChild(divMessage);
                }else{
                    let divMessage=document.createElement("div");
                    divMessage.classList.add("divMyMessage");
                    let message=document.createElement("span");
                    message.classList.add("messageOfMe");
                    message.innerHTML=element.content;
                    divMessage.appendChild(message);
                    boxChat.appendChild(divMessage);
                }
        })}
    })

}

async function allConversations(){
    let arrayUsername= await arrayAllUsersUsername()
    let arrayUsersId=await arrayAllUsersId()
    let arrayImage=await arrayAllUsersImage()
    console.log("arrayUsersId",arrayUsersId)
    for(let i=0; i<arrayUsersId.length; i++){
        let divUser=document.createElement("div");
        divUser.classList.add("usernameBoxAccueil");
        let imageUser=document.createElement("img");
        imageUser.src=arrayImage[i]
        imageUser.classList.add("imageUsernameBoxAccueil");
        let username=document.createElement("span");
        username.textContent=arrayUsername[i]
        username.classList.add("textUsernameBoxAccueil");
        divUser.appendChild(imageUser);
        divUser.appendChild(username);
        divUser.setAttribute("id",arrayUsersId[i]);
        pageAccueil.appendChild(divUser)
        divUser.addEventListener("click",() =>{
            pageAccueil.style.display="none";
            pageChat.style.display="flex";
            displayMessages(arrayUsersId[i])
        })
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
            //console.log("mon token :",token)
            //console.log("appel fonction",arrayAllUsers())

            if(testToken(token)){
                pageForm.style.display = "none";
                pageAccueil.style.display = "flex";
                allConversations()
            }
        })
})