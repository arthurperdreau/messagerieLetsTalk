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
const buttonBackToHome=document.querySelector(".buttonBackToHome");
let userName=""

const sendButton=document.querySelector(".buttonChatBtn");
const refreshButton=document.querySelector(".refreshButton");


//-------------------------------functions-------------------------------
//-->log you in the app
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

//-->test if the token is valid
function testToken(token) {
    if (!(token===null||token===undefined)) {
        return true
    }
}

//--> functions to have all the ids, usernames and the profiles pictures of all the users
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

//-->useful to have all the id of the privates conversations with the id of the author
async function allPrivateConversation(){
    let arrayCoupleIdUserIdConversation=[];
    let paramsAllConversation={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    return await fetch("https://b1messenger.esdlyon.dev/api/private/conversations",paramsAllConversation)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            arrayCoupleIdUserIdConversation.push([element.with.id,element.id])
        })
        return arrayCoupleIdUserIdConversation
    })

}

//-->useful to have the id of a private conversation with the id of the interlocutor
async function testPrivateConversation(idUser){
    let arrayIdConversation=await allPrivateConversation()
    let goodCouple
    for(let i=0;i<arrayIdConversation.length;i++){
        if(arrayIdConversation[i][0]===idUser){
            goodCouple = arrayIdConversation[i]
            break
        }
    }
    return goodCouple
}

//-->display private message in the different privates conversations sections
async function displayMessages(idUser){
    let authorization={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    console.log("idUser",idUser)
    let goodId=await testPrivateConversation(idUser)
    console.log("goodID",goodId)
    if(!(goodId===undefined)){
        fetch(`https://b1messenger.esdlyon.dev/api/private/conversation/${goodId[1]}`, authorization)
        .then(response => response.json())
        .then(data => {
            console.log("displayMessage")
            let conversation=data.privateMessages
            console.log("conversation",conversation)
            if(!(conversation===undefined)){
                conversation.forEach(element => {
                    if(element.author.id===goodId[0]){
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
    })}

}

//-->display all the message in the general section
async function displayMessagesGeneral(){
    let authorizationGeneral={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    fetch("https://b1messenger.esdlyon.dev/api/messages",authorizationGeneral)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            if(element.author.username===userName){
                let divMessageAll=document.createElement("div");
                divMessageAll.classList.add("divMyMessage");
                let messageAll=document.createElement("span");
                messageAll.classList.add("messageOfMe");
                messageAll.innerHTML=element.content;
                divMessageAll.appendChild(messageAll);
                boxChat.appendChild(divMessageAll);
            }else{
            let divMessageAll=document.createElement("div");
            divMessageAll.classList.add("divPrivateMessage")
            let authorAll=document.createElement("span");
            authorAll.classList.add("author")
            authorAll.innerHTML=element.author.username;
            let messageAll=document.createElement("span");
            messageAll.classList.add("messageOfFriend");
            messageAll.innerHTML=element.content;
            divMessageAll.appendChild(authorAll);
            divMessageAll.appendChild(messageAll);
            boxChat.appendChild(divMessageAll);}
            if(!(element.responses===undefined || element.responses===[])){
                let responsesContent=element.responses
                responsesContent.forEach(response => {
                    if(!(response.author.username===userName)){
                    let divMessageResponse=document.createElement("div");
                    divMessageResponse.classList.add("divResponse")
                    let authorResponse=document.createElement("span");
                    authorResponse.classList.add("author")
                    authorResponse.innerHTML=response.author.username;
                    let messageAllResponse=document.createElement("span");
                    messageAllResponse.classList.add("messageOfFriend");
                    messageAllResponse.innerHTML=response.content;
                    divMessageResponse.appendChild(authorResponse);
                    divMessageResponse.appendChild(messageAllResponse);
                    boxChat.appendChild(divMessageResponse);}
                    else{
                        let divMessageResponseMe=document.createElement("div");
                        divMessageResponseMe.classList.add("divResponseOfMe")
                        let authorResponse=document.createElement("span");
                        let messageAllResponse=document.createElement("span");
                        messageAllResponse.classList.add("messageOfMe");
                        messageAllResponse.innerHTML=response.content;
                        divMessageResponseMe.appendChild(messageAllResponse);
                        boxChat.appendChild(divMessageResponseMe);
                    }
                })
            }
        })
    })
}

//-->display all the conversations
async function allConversations(){

    let arrayUsername= await arrayAllUsersUsername()
    let arrayUsersId=await arrayAllUsersId()
    let arrayImage=await arrayAllUsersImage()
    //console.log("arrayUsersId",arrayUsersId)
    let boxChatGeneral=document.createElement("div");
    boxChatGeneral.classList.add("usernameBoxAccueil");
    let imageChatGeneral=document.createElement("img");
    imageChatGeneral.src="images/allProfilePicture.png"
    imageChatGeneral.classList.add("imageUsernameBoxAccueil");
    let textChatGeneral=document.createElement("span");
    textChatGeneral.innerHTML="Général";
    textChatGeneral.classList.add("textUsernameBoxAccueil");
    boxChatGeneral.setAttribute("id","general");
    boxChatGeneral.appendChild(imageChatGeneral);
    boxChatGeneral.appendChild(textChatGeneral);
    pageAccueil.appendChild(boxChatGeneral);
    boxChatGeneral.addEventListener("click", ()=>{
        pageAccueil.style.display="none";
        pageChat.style.display="flex";
        sendButton.setAttribute("id","general");
        displayMessagesGeneral()
    })
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
            sendButton.setAttribute("id",arrayUsersId[i]);
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

//-->Login
loginBtn.addEventListener("click", () => {
    let loginUsernameInput = document.querySelector(".loginUsernameInput");
    userName = loginUsernameInput.value;
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

//-->come back to the list of the conversations
buttonBackToHome.addEventListener("click",()=>{
    boxChat.innerHTML=""
    pageChat.style.display="none";
    pageAccueil.style.display="flex";
})

//-->send message
sendButton.addEventListener("click",()=>{
    let inputChat=document.querySelector(".inputChat");
    let textMessage=inputChat.value;
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({
            content:textMessage,
        })
    }
    inputChat.value="";
    if(!(sendButton.id==="general")){
    fetch(`https://b1messenger.esdlyon.dev/api/private/message/${sendButton.id}`,params)
    .then(response => response.json())
    .then(data => {
        //console.log("data après l'envoie",data)
        //console.log("id sendButton",sendButton.id)
        let authorization={
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        }
        fetch(`https://b1messenger.esdlyon.dev/api/private/conversation/${data.id}`, authorization)
            .then(response => response.json())
            .then(rep => {
                //console.log("je suis dans le fetch")
                boxChat.innerHTML=""
                let conv=rep.privateMessages
                if(!(conv===undefined)){
                    conv.forEach(element => {
                        if(element.author.id===data.with.id){
                            let divMessages=document.createElement("div");
                            divMessages.classList.add("divPrivateMessage")
                            let message=document.createElement("span");
                            message.classList.add("messageOfFriend");
                            message.innerHTML=element.content;
                            divMessages.appendChild(message);
                            boxChat.appendChild(divMessages);
                        }else{
                            let divMessages=document.createElement("div");
                            divMessages.classList.add("divMyMessage");
                            let message=document.createElement("span");
                            message.classList.add("messageOfMe");
                            message.innerHTML=element.content;
                            divMessages.appendChild(message);
                            boxChat.appendChild(divMessages);
                        }
                    })}})

    })}else{
        fetch("https://b1messenger.esdlyon.dev/api/messages/new",params)
        .then(response => response.json())
        .then(data => {
            boxChat.innerHTML=""
            displayMessagesGeneral()
        })
    }
})

//-->refresh a conversation with a button
refreshButton.addEventListener("click", ()=>{
    if(!(sendButton.id==="general")){
        console.log(sendButton.id);
        console.log("refresh")
        boxChat.innerHTML=""
        displayMessages(sendButton.id)
        console.log("refresh après")
    }else{
        console.log("refresh general")
        boxChat.innerHTML=""
        displayMessagesGeneral()
    }

})