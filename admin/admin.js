let isVotingRef = firebase.database().ref('mask/isVoting');
let userRef = firebase.database().ref('mask/users');
let questionRef = firebase.database().ref('mask/setting/question');
let btnRef = firebase.database().ref('mask/setting/btn');
let votingRef = firebase.database().ref('mask/voting');

let viewLogin = document.getElementById("login");
let view = document.getElementById("viewer");


let inputID = document.getElementById("inputID");
let inputPassword = document.getElementById("inputPassword");
let loginInfo = document.getElementById("loginInfo");

let inputQuestion = document.getElementById("inputQuestion");
let inputButton = document.getElementById("inputButton");
let textInfo = document.getElementById("textInfo");
let textQuestion = document.getElementById("textQuestion");
let textVote = document.getElementById("textVote");
let textDB = document.getElementById("textDB");

viewLogin.style.display="none";
view.style.display="none";


function event(){

}

function eventReset(){

}

function adminLogin(){
    firebase.auth().signInWithEmailAndPassword(inputID.value, inputPassword.value)
        .then(function(){
            loginInfo.innerHTML = "로그인 요청됨"
        })
        .catch(function(error) {

            loginInfo.innerHTML = "로그인 중 에러 발생!\n"
                +error.code + '\n'
                +error.message;

    });
}

function setVote(){
    isVotingRef.set(false);

    let arrVote = [];
    let arrBtn = inputButton.value.split(',');

    for (let i in arrBtn){
        arrVote.push({
            id: i,
            name: arrBtn[i]
        })
    }
    questionRef.set(inputQuestion.value);
    btnRef.set(arrVote);
    textInfo.innerHTML = "준비 요청됨"

}

function startVote(){
    isVotingRef.set(true);
    textInfo.innerHTML = "시작 요청됨"
}

function endVote(){
    isVotingRef.set(false);
    textInfo.innerHTML = "종료 요청됨"
}

function resetStatus(){
    isVotingRef.set(false);
    votingRef.set('');
    btnRef.set('');
    userRef.once('value').then(function(snapshot){
        let num = 0;
        snapshot.forEach(function (child){
            num = num + 1;
            userRef.child(child.key).child("status").set(false);
            textInfo.innerHTML = snapshot.numChildren() + '명 중 ' + num +'명 status 초기화 요청됨\n'
                + "(" + (num/snapshot.numChildren()*100) + "%)"
        })
    })
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        view.style.display = "inline";
        viewLogin.style.display = "none";

        let textify = function(snapshot, err){
            let text = JSON.stringify(snapshot.val());
            if(!text || text === '""'){
                text = err
            }

            return text;
        };

        votingRef.on('value', function(snapshot){
            textDB.innerText = textify(snapshot, "현재 집계 중인 투표가 없습니다.");
        });

        questionRef.on('value', function(snapshot){
            textQuestion.innerText = textify(snapshot, "현재 설정된 투표가 없습니다.");
        });

        btnRef.on('value', function(snapshot){
            textVote.innerText = textify(snapshot, "");
        })

    } else {
        view.style.display = "none";
        viewLogin.style.display = "inline";
    }
});