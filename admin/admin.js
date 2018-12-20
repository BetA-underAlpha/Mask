let isVotingRef = firebase.database().ref('mask/isVoting');
let userRef = firebase.database().ref('mask/users');
let questionRef = firebase.database().ref('mask/setting/question');
let btnRef = firebase.database().ref('mask/setting/btn');
let votingRef = firebase.database().ref('mask/voting');
let adminRef = firebase.database().ref('mask/adminLogin');

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

viewLogin.style.display = "none";
view.style.display = "none";

function eventStart() {
    textInfo.innerText = "추첨을 위한 user 리스트를 서버에 요청했습니다.";
    userRef.once('value').then(function (snapshot) {
        textInfo.innerText = "리스트를 모두 가져왔습니다. 추첨을 시작합니다.";

        let keys = Object.keys(snapshot.val());
        let randomKey = keys[ keys.length * Math.random() << 0];
        let pickedUser = snapshot.val()[randomKey];
        function loadHistory(current){
            textInfo.innerText = textInfo.innerText + "\n현재 추첨된 학번은 아래와 같습니다.\n";
            snapshot.forEach(function (child) {
                child = child.val();
                if(child.event === true || child.num === current){
                    textInfo.innerText = textInfo.innerText + child.num + '\n';
                }
            })
        }

        userRef.child(randomKey).child("event").set(true)
            .then(function(){
                textInfo.innerText = "학번 " + pickedUser.num + "님이 추첨되었습니다.";
                loadHistory(pickedUser.num);
            })
            .catch(function(err){
                textInfo.innerText = "학번 " + pickedUser.num + "님이 추첨되었으나, 신호를 보내는데 실패했습니다. 직접 호명해주세요.\n" + err;
                loadHistory(pickedUser.num);
            });
    })
}

function eventReset() {
    textInfo.innerText = "EVENT 초기화를 서버에 요청했습니다.";
    userRef.once('value').then(function (snapshot) {
        let num = 0;
        let failed = 0;
        snapshot.forEach(function (child) {
            userRef.child(child.key).child("event").set(false)
                .then(function(){
                    num = num+1;
                    textInfo.innerText = 'EVENT 초기화: ' + snapshot.numChildren() + '명 중 ' + num + '명 성공 ' + failed + '명 실패';
                })
                .catch(function(){
                    failed = failed +1;
                    textInfo.innerText = 'EVENT 초기화: ' + snapshot.numChildren() + '명 중 ' + num + '명 성공 ' + failed + '명 실패';
                    if(failed === 1) alert('EVENT 초기화 중 실패 인원이 발생하였습니다. 모두 완료된 후 다시 시도해주세요.')
                });
        })
    })
}

function logout() {
    if (confirm("로그아웃 하시겠습니까?")) {
        firebase.auth().signOut().then(function () {
            alert('로그아웃 되었습니다.')
        }).catch(function (error) {
            alert('로그아웃 중 오류가 발생했습니다. 새로고침 해주세요.\n' + error)
        });
    }
}

function adminLogin() {
    firebase.auth().signInWithEmailAndPassword(inputID.value, inputPassword.value)
        .then(function () {
            loginInfo.innerHTML = "로그인을 요청하는 중입니다..."
        })
        .catch(function (error) {

            loginInfo.innerHTML = "로그인 중 에러 발생!\n"
                + error.code + '\n'
                + error.message;

        });
}

function setVote() {
    isVotingRef.set(false);

    let arrVote = [];
    let arrBtn = inputButton.value.replace(/, /gi,',').split(',');

    for (let i in arrBtn) {
        arrVote.push({
            id: i,
            name: arrBtn[i]
        })
    }
    questionRef.set(inputQuestion.value);
    textInfo.innerText = "준비를 서버에 요청했습니다.";
    btnRef.set(arrVote)
        .then(function(){
            textInfo.innerText = "투표가 준비되었습니다."
        })
        .catch(function(err){
            textInfo.innerText = "투표를 준비하는 중 오류가 발생했습니다. 다시 시도해주세요.\n" + err;
        });

}

function startVote() {
    if(textQuestion.innerText === "현재 설정된 투표가 없습니다."){
        alert("현재 설정된 투표가 없습니다.")
    } else {
        textInfo.innerText = "시작을 서버에 요청했습니다.";

        isVotingRef.set(true)
            .then(function(){
                textInfo.innerText = "투표가 시작되었습니다."
            })
            .catch(function(err){
                textInfo.innerText = "투표를 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.\n" + err;
            });
    }

}

function endVote() {
    textInfo.innerText = "종료를 서버에 요청했습니다.";
    isVotingRef.set(false)
        .then(function(){
            textInfo.innerText = "투표가 종료되었습니다."
        })
        .catch(function(err){
            textInfo.innerText = "투표를 종료하는 중 오류가 발생했습니다. 다시 시도해주세요.\n" + err;
        });
}

function resetStatus() {
    isVotingRef.set(false);
    votingRef.set('');
    btnRef.set('');
    questionRef.set('');
    textInfo.innerText = "STATUS 초기화를 서버에 요청했습니다.";
    userRef.once('value').then(function (snapshot) {
        let num = 0;
        let failed = 0;
        snapshot.forEach(function (child) {
            userRef.child(child.key).child("status").set(false)
                .then(function(){
                    num = num+1;
                    textInfo.innerText = 'STATUS 초기화: ' + snapshot.numChildren() + '명 중 ' + num + '명 성공 ' + failed + '명 실패';
                })
                .catch(function(){
                    failed = failed +1;
                    textInfo.innerText = 'STATUS 초기화: ' + snapshot.numChildren() + '명 중 ' + num + '명 성공 ' + failed + '명 실패';
                    if(failed === 1) alert('STATUS 초기화 중 실패 인원이 발생하였습니다. 모두 완료된 후 다시 시도해주세요.')
                });
        })
    })
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        adminRef.set(String(new Date()))
            .then(function () {
                loginInfo.innerHTML = "";
                view.style.display = "inline";
                viewLogin.style.display = "none";

                let textify = function (snapshot, option, err) {

                    let text = "";

                    if(option === "voting"){
                        text=JSON.stringify(snapshot.val());
                        if(text==='""'){
                            text = err;
                        }
                    } else if (option === "question") {
                        text = snapshot.val();
                        if(!text){
                            text = err
                        } else {
                            text = text + ": "
                        }
                    } else if (option === "btn") {
                        if(JSON.stringify(snapshot)==='""'){
                            text = err;
                        } else {
                            snapshot.val().forEach(function(child){
                                text = text + child.name + ", ";
                            });
                            text = text.slice(0,-2);
                        }

                    }
                    return text;
                };

                votingRef.on('value', function (snapshot) {
                    textDB.innerText = textify(snapshot, "voting", "현재 집계 중인 투표가 없습니다.");
                });

                questionRef.on('value', function (snapshot) {
                    textQuestion.innerText = textify(snapshot, "question", "현재 설정된 투표가 없습니다.");
                });

                btnRef.on('value', function (snapshot) {
                    textVote.innerText = textify(snapshot, "btn", "");
                })
            })
            .catch(function (err) {
                firebase.auth().signOut()
                    .then(function () {
                        alert("문제가 발생하여 자동으로 로그아웃 되었습니다.\n" + err)
                    })
                    .catch(function (e) {
                        alert("문제가 발생하여 자동으로 로그아웃 하는 중 오류가 발생하였습니다. 새로고침 해주세요.\n" + e)
                    })
            });

    } else {
        view.style.display = "none";
        viewLogin.style.display = "inline";
    }
});