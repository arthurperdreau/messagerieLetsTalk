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
const namePeople=document.querySelector(".namePeople");

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
        console.log("arrayCoupleIdUserIdConversation",arrayCoupleIdUserIdConversation)
        return arrayCoupleIdUserIdConversation
    })

}

//-->useful to have the id of a private conversation with the id of the interlocutor
async function testPrivateConversation(idUser){
    let arrayIdConversation=await allPrivateConversation()
    let goodCouple
    console.log("goodCouple après ini",goodCouple)
    console.log("arrayIdConversation[i] idUser",idUser)
    for(let i=0;i<arrayIdConversation.length;i++){
        if(arrayIdConversation[i][0]===idUser){
            console.log("arrayIdConversation[i]",arrayIdConversation[i])
            goodCouple = arrayIdConversation[i]
            break;
        }
    }
    console.log("goodCouple après boucle for",goodCouple)
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
                        divMessage.setAttribute("id",element.id);
                        boxChat.appendChild(divMessage);
                        if(!(element.images===[])){
                            let images=element.images;
                            images.forEach(image=>{
                                let img=document.createElement("img");
                                img.classList.add("imageMessage");
                                img.src=image.url
                                divMessage.appendChild(img);
                            })
                        }
                    }else {
                        let divMessage = document.createElement("div");
                        divMessage.classList.add("divMyMessage");
                        let message = document.createElement("span");
                        message.classList.add("messageOfMe");
                        message.innerHTML = element.content;
                        divMessage.appendChild(message);
                        divMessage.setAttribute("id", element.id);
                        boxChat.appendChild(divMessage);
                        if (!(element.images === [])) {
                            let images = element.images;
                            images.forEach(image => {
                                let img = document.createElement("img");
                                img.classList.add("imageMessage");
                                img.src = image.url
                                divMessage.appendChild(img);
                            })
                        }
                    }
            })}
    })}
}
async function editMessage(idMessage){
    let inputEdit=document.querySelector(".inputEdit");
    let params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({
            content:inputEdit.value,
        })
    }
    await fetch(`https://b1messenger.esdlyon.dev/api/messages/${idMessage}/edit`,params)
    inputEdit.value="";
    boxChat.innerHTML=""
    displayMessagesGeneral()
}

function addRemoveReaction(emoji,idMessage){
    let params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        },
    }
    fetch(`https://b1messenger.esdlyon.dev/api/reaction/message/${idMessage}/${emoji.id}`,params)
        .then(res=>{
            let emojiSelectBox=document.querySelector(".emojiSelectBox");
            emojiSelectBox.style.display="none";
            boxChat.innerHTML=""
            displayMessagesGeneral()
        })
}
function addRemoveReactionPrivate(emoji,idMessage){
    let sendButton=document.querySelector(".buttonChatBtn");

    let params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        },
    }
    fetch(`https://b1messenger.esdlyon.dev/api/private/message/${idMessage}/${emoji.id}`,params)
        .then(res=>{
            let emojiSelectBox=document.querySelector(".emojiSelectBox");
            emojiSelectBox.style.display="none";
            boxChat.innerHTML=""
            displayMessages(sendButton.id);
        })
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
        console.log("j'y suis")
        data.forEach(element => {
            if(element.author.username===userName){
                let divMessageAll=document.createElement("div");
                divMessageAll.classList.add("divMyMessage");
                let messageAll=document.createElement("span");
                messageAll.classList.add("messageOfMe");
                messageAll.innerHTML=element.content;
                divMessageAll.appendChild(messageAll);
                divMessageAll.setAttribute("id",element.id);
                boxChat.appendChild(divMessageAll);
                if(!(element.images===[]|| element.images===undefined)){
                    let images=element.images;
                    images.forEach(image=>{
                        let img=document.createElement("img");
                        img.classList.add("imageMessage");
                        img.src=image.url
                        divMessageAll.appendChild(img);
                    })
                }
                //-->button edit
                let editButton=document.createElement("button");
                editButton.classList.add("buttonEdit");
                editButton.innerHTML=`<svg class="svgEdit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/></svg>`
                divMessageAll.appendChild(editButton)
                editButton.addEventListener("click",()=>{
                    let idMessage=divMessageAll.id;
                    let modal=document.getElementById("myModal");
                    let buttonEditBtn=document.querySelector(".buttonEditBtn");
                    buttonEditBtn.id=idMessage
                    buttonEditBtn.addEventListener("click",()=>{
                        editMessage(idMessage);
                        modal.style.display = "none";
                    })
                    modal.style.display = "flex";
                })

                //-->button delete
                let deleteButton=document.createElement("button");
                deleteButton.classList.add("buttonDelete");
                deleteButton.innerHTML=`<svg class="svgTrash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`
                divMessageAll.appendChild(deleteButton)
                deleteButton.addEventListener("click",()=>{
                    let idMessage=divMessageAll.id;
                    deleteMessage(idMessage);
                })

                //-->button respond
                let responseButton=document.createElement("button");
                let inputChat=document.querySelector(".inputChat");
                responseButton.classList.add("buttonResponse");
                responseButton.innerHTML=`<svg class="svgResponse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>`
                divMessageAll.appendChild(responseButton)
                responseButton.addEventListener("click",()=>{
                    inputChat.classList.add("responseInput");
                    inputChat.id=divMessageAll.id
                })

                //-->let button Emoji
                let emojiButton=document.createElement("button");
                emojiButton.classList.add("emojiButton");
                emojiButton.innerHTML="+"
                divMessageAll.appendChild(emojiButton)
                emojiButton.addEventListener("click",()=>{
                    let idMessage=divMessageAll.id;
                    let emojiSelectBox=document.createElement("div");
                    emojiSelectBox.classList.add("emojiSelectBox");
                    let emojiSmile=document.createElement("span");
                    emojiSmile.textContent="🙂"
                    emojiSmile.setAttribute("id","smile");
                    emojiSmile.addEventListener("click",()=>{
                        addRemoveReaction(emojiSmile,idMessage)
                    })
                    let emojiHappy=document.createElement("span");
                    emojiHappy.textContent="😃"
                    emojiHappy.setAttribute("id","happy");
                    emojiHappy.addEventListener("click",()=>{
                        addRemoveReaction(emojiHappy,idMessage)
                    })
                    let emojiSad=document.createElement("span");
                    emojiSad.textContent="😭"
                    emojiSad.setAttribute("id","sadd");
                    emojiSad.addEventListener("click",()=>{
                        addRemoveReaction(emojiSad,idMessage)
                    })
                    let emojiCry=document.createElement("span");
                    emojiCry.textContent="😢"
                    emojiCry.setAttribute("id","cryy");
                    emojiCry.addEventListener("click",()=>{
                        addRemoveReaction(emojiCry,idMessage)
                    })
                    let emojiVomi=document.createElement("span");
                    emojiVomi.textContent="🤢"
                    emojiVomi.setAttribute("id","vomi");
                    emojiVomi.addEventListener("click",()=>{
                        addRemoveReaction(emojiVomi,idMessage)
                    })
                    emojiSelectBox.appendChild(emojiSmile);
                    emojiSelectBox.appendChild(emojiHappy);
                    emojiSelectBox.appendChild(emojiSad);
                    emojiSelectBox.appendChild(emojiCry);
                    emojiSelectBox.appendChild(emojiVomi);
                    divMessageAll.appendChild(emojiSelectBox);
                })

                //-->réactions
                if(!(element.reactions===[])) {
                    let allReactions=element.reactions
                    let reactionsBox = document.createElement("div");
                    reactionsBox.classList.add("reactionsBox");
                    allReactions.forEach(reaction=>{
                        let reactionSmiley=document.createElement("span");
                        switch(reaction.type){
                            case "smile":
                                reactionSmiley.innerHTML="🙂"
                                break;
                            case "happy":
                                reactionSmiley.innerHTML="😃"
                                break;
                            case "sadd":
                                reactionSmiley.innerHTML="😭"
                                break;
                            case "cryy":
                                reactionSmiley.innerHTML="😢"
                                break;
                            case "vomi":
                                reactionSmiley.innerHTML="🤢"
                                break;
                        }
                        reactionsBox.appendChild(reactionSmiley);
                        divMessageAll.appendChild(reactionSmiley);
                    })
                }
            }else{
            let divMessageAll=document.createElement("div");
            divMessageAll.setAttribute("id",element.id);
            divMessageAll.classList.add("divPrivateMessage")
            let authorAll=document.createElement("span");
            authorAll.classList.add("author")
            authorAll.innerHTML=element.author.username;
            let messageAll=document.createElement("span");
            messageAll.classList.add("messageOfFriend");
            messageAll.innerHTML=element.content;
            divMessageAll.appendChild(authorAll);
            divMessageAll.appendChild(messageAll);
            boxChat.appendChild(divMessageAll);
            if(!(element.images===[] || element.images===undefined)){
                let image=element.images;
                image.forEach(image=>{
                    let img=document.createElement("img");
                    img.classList.add("imageMessage");
                    img.src=image.url
                    divMessageAll.appendChild(img);
                })
            }
            let responseButton1=document.createElement("button");
            let inputChat=document.querySelector(".inputChat");
            responseButton1.classList.add("buttonResponse");
            responseButton1.innerHTML=`<svg class="svgResponse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>`
            divMessageAll.appendChild(responseButton1)
            responseButton1.addEventListener("click",()=>{
                inputChat.classList.add("responseInput");
                inputChat.id=divMessageAll.id
            })
                if(!(element.reactions===[])) {
                    let allReactions=element.reactions

                    let reactionsBox = document.createElement("div");
                    reactionsBox.classList.add("reactionsBox");
                    allReactions.forEach(reaction=>{
                        let reactionSmiley1=document.createElement("span");
                        switch(reaction.type){
                            case "smile":
                                reactionSmiley1.innerHTML="🙂"
                                break;
                            case "happy":
                                reactionSmiley1.innerHTML="😃"
                                break;
                            case "sadd":
                                reactionSmiley1.innerHTML="😭"
                                break;
                            case "cryy":
                                reactionSmiley1.innerHTML="😢"
                                break;
                            case "vomi":
                                reactionSmiley1.innerHTML="🤢"
                                break;
                        }
                        reactionsBox.appendChild(reactionSmiley1);
                        divMessageAll.appendChild(reactionSmiley1);
                    })
                }
                //-->let button Emoji
                let emojiButton=document.createElement("button");
                emojiButton.classList.add("emojiButton");
                emojiButton.innerHTML="+"
                divMessageAll.appendChild(emojiButton)
                emojiButton.addEventListener("click",()=>{
                    let idMessage=divMessageAll.id;
                    let emojiSelectBox=document.createElement("div");
                    emojiSelectBox.classList.add("emojiSelectBox");
                    let emojiSmile=document.createElement("span");
                    emojiSmile.textContent="🙂"
                    emojiSmile.setAttribute("id","smile");
                    emojiSmile.addEventListener("click",()=>{
                        addRemoveReaction(emojiSmile,idMessage)
                    })
                    let emojiHappy=document.createElement("span");
                    emojiHappy.textContent="😃"
                    emojiHappy.setAttribute("id","happy");
                    emojiHappy.addEventListener("click",()=>{
                        addRemoveReaction(emojiHappy,idMessage)
                    })
                    let emojiSad=document.createElement("span");
                    emojiSad.textContent="😭"
                    emojiSad.setAttribute("id","sadd");
                    emojiSad.addEventListener("click",()=>{
                        addRemoveReaction(emojiSad,idMessage)
                    })
                    let emojiCry=document.createElement("span");
                    emojiCry.textContent="😢"
                    emojiCry.setAttribute("id","cryy");
                    emojiCry.addEventListener("click",()=>{
                        addRemoveReaction(emojiCry,idMessage)
                    })
                    let emojiVomi=document.createElement("span");
                    emojiVomi.textContent="🤢"
                    emojiVomi.setAttribute("id","vomi");
                    emojiVomi.addEventListener("click",()=>{
                        addRemoveReaction(emojiVomi,idMessage)
                    })
                    emojiSelectBox.appendChild(emojiSmile);
                    emojiSelectBox.appendChild(emojiHappy);
                    emojiSelectBox.appendChild(emojiSad);
                    emojiSelectBox.appendChild(emojiCry);
                    emojiSelectBox.appendChild(emojiVomi);
                    divMessageAll.appendChild(emojiSelectBox);
                })
            }

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
                    divMessageResponse.setAttribute("id",response.id);
                    divMessageResponse.appendChild(messageAllResponse);
                    boxChat.appendChild(divMessageResponse);
                        if(!(element.images===[]|| element.images===undefined)){
                            let images=element.images;
                            images.forEach(image=>{
                                let img=document.createElement("img");
                                img.classList.add("imageMessage");
                                img.src=image.url
                                divMessageResponse.appendChild(img);
                            })
                        }

                    }
                    else{
                        let divMessageResponseMe=document.createElement("div");
                        divMessageResponseMe.classList.add("divResponseOfMe")
                        let messageAllResponse=document.createElement("span");
                        messageAllResponse.classList.add("messageOfMe");
                        messageAllResponse.innerHTML=response.content;
                        divMessageResponseMe.appendChild(messageAllResponse);
                        divMessageResponseMe.setAttribute("id",response.id);
                        boxChat.appendChild(divMessageResponseMe);
                        if(!(element.images===[] || element.images===undefined)){
                            let images=element.images;
                            images.forEach(image=>{
                                let img=document.createElement("img");
                                img.classList.add("imageMessage");
                                img.src=image.url
                                divMessageResponseMe.appendChild(img);
                            })
                        }

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
        namePeople.textContent="Général"

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
            //console.log("sendButton.id allConv",sendButton.id);
            //console.log("arrayUserId[i] allConv",arrayUsersId[i]);
            displayMessages(arrayUsersId[i])
            namePeople.textContent=arrayUsername[i]
        })
    }
}

async function deleteMessage(idMessage){
    let authorizationGeneral={
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    fetch(`https://b1messenger.esdlyon.dev/api/messages/delete/${idMessage}`,authorizationGeneral)
    .then(res => res.json())
    .then(json => {
        boxChat.innerHTML=""
        displayMessagesGeneral()
    })
}

async function sendResponse(idMessage){
    let inputChat=document.querySelector(".inputChat");

    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({
            content:inputChat.value,
        })
    }
    console.log(inputChat.value)
    console.log("idMessage",idMessage)
    await fetch(`https://b1messenger.esdlyon.dev/api/responses/${idMessage}/new`,params)
    .then(res => res.json())
    .then(json => {
        console.log(json);
        boxChat.innerHTML=""
        displayMessagesGeneral()
        console.log("repppppppppppppppppppppppppp")
        inputChat.classList.remove("responseInput");
    })
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
    namePeople.textContent=""
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
                        inputChat.value="";
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



                                    //-->réactions
                                    if(!(element.reactions===[])) {
                                        let allReactions=element.reactions
                                        let reactionsBox = document.createElement("div");
                                        reactionsBox.classList.add("reactionsBox");
                                        allReactions.forEach(reaction=>{
                                            let reactionSmiley=document.createElement("span");
                                            switch(reaction.type){
                                                case "smile":
                                                    reactionSmiley.innerHTML="🙂"
                                                    break;
                                                case "happy":
                                                    reactionSmiley.innerHTML="😃"
                                                    break;
                                                case "sadd":
                                                    reactionSmiley.innerHTML="😭"
                                                    break;
                                                case "cryy":
                                                    reactionSmiley.innerHTML="😢"
                                                    break;
                                                case "vomi":
                                                    reactionSmiley.innerHTML="🤢"
                                                    break;
                                            }
                                            reactionsBox.appendChild(reactionSmiley);
                                            divMessages.appendChild(reactionSmiley);
                                        })

                                    }}
                            })}})
    })}else{
        if(!(inputChat.classList.contains("responseInput"))){
        console.log(params)
        fetch("https://b1messenger.esdlyon.dev/api/messages/new",params)
            .then(response => response.json())
            .then(data => {
                boxChat.innerHTML=""
                inputChat.value="";
                displayMessagesGeneral()
                console.log("c envoyé");
            })}else{
            sendResponse(inputChat.id)
            inputChat.value="";
        }
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


