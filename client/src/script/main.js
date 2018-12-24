console.log("BJHS RVS\n" +
    "BusanJin High School Realtime Vote System\n" +
    "Copyright 2018. 민재. All right reserved.\n" +
    "https://github.com/BetA-underAlpha");

const MSG_COMPLETE = '투표에 성공적으로 참여했습니다!';
const MSG_WAIT = '투표 대기 중 입니다아';
const MSG_VOTING = '서버와 통신 중입니다. 절대로 화면을 벗어나지 마세요!';
const MSG_CHKNUM = '학번을 다시 확인해주세요! 다섯자리 형식으로 입력해야 합니다. ex)30629';
const MSG_PUTNUM = '학번을 입력해주세요!';
const MSG_SIGNING = '등록 중입니다. 절대로 화면을 벗어나지 마세요!';
const MSG_END = '투표가 종료되었습니다.';
const MSG_LOADING = 'Loading...';
const MSG_NOTNUM = "올바른 형식이 아닙니다. 다시 시도해주세요. ex) 30629";

Number.prototype.between = function(a, b) {
    let min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
};

let app = new Vue({
    el: '#app',
    data () {
        return {
            snackbar: false,
            y: 'bottom',
            x: 'right',
            mode: '',
            timeout: 5000,
            text: '',
            color:'white'
        }
    }
});

let snack = function (msg){
    document.getElementById("app").style.display="inline";
    app.snackbar = false;
    app.text = msg;
    app.snackbar = true;
};

let input_studentNum = new Vue({
    el:'#input_studentNum',
    data:{
        studentNum: null
    }
});

let chkDup = function(studentNum){
    return new Promise(function(resolve, reject){
        try{
            firebase.database().ref('mask/users/').once('value').then(function(dsnapshot){
                dsnapshot.forEach(function (snapshot){
                    let obj = snapshot.val();
                    if(String(obj.num) === String(studentNum)){
                        resolve(true)
                    }
                });
                resolve(false)
            });
        } catch(exception){
            reject(exception)
        }

    });
};

let login = function(){
    let studentNum = input_studentNum.studentNum;

    let wrongInput = function(){
        //Animation
        input_studentNum.studentNum = "";
    };

    if(studentNum){
        if(Number(studentNum)===20001223){
            if(confirm("Admin 페이지로 이동할까요?")){
                window.open(adminURL, '_blank');
            }
        }
        if(Number.isInteger(Number(studentNum))){
            if(studentNum.length === 5
                && Number(studentNum).between(10000,40000)
                && Number(studentNum.charAt(0)).between(0,4)
                && (studentNum.charAt(1) ==="0")
                && Number(studentNum.charAt(2)).between(0,8)
                && Number(studentNum.substring(3)).between(0,40)
            ){
                makeSigningMode();
                chkDup(studentNum)
                    .then(function(isDup){
                        if(isDup){
                            snack('학번 '+studentNum+'은 이미 등록된 학번입니다.');
                            wrongInput();
                            makeSignMode();
                        } else {
                            if(confirm("학번 " + studentNum + "으로 등록을 진행할까요?\n등록이 완료되면 변경할 수 없습니다.")){
                                firebase.auth().signInAnonymously()
                                    .then(function(){
                                        let user = firebase.auth().currentUser;
                                        let userRef = firebase.database().ref('mask/users/'+user.uid);
                                        userRef.child('num').set(Number(studentNum));
                                        userRef.child('status').set(false);
                                        userRef.child('event').set(false);
                                        snack('학번 '+studentNum+'으로 등록이 완료되었습니다!');
                                    })
                                    .catch(function(error){
                                        snack('등록 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요!\n'+error.code + '\n' + error.message);
                                        wrongInput()
                                    });
                            } else {
                                makeSignMode();
                                snack("등록이 취소되었습니다.")
                            }
                        }
                    })
                    .catch(function(error){
                        snack('학번 확인 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요!\n'+error);
                        wrongInput()
                    });
        } else {
            snack(MSG_NOTNUM);
            wrongInput()
        }

        } else {
            snack(MSG_CHKNUM);
            wrongInput()
        }
    } else {
        snack(MSG_PUTNUM);
        wrongInput()
    }
};

let enterKey = function(){
    if(window.event.keyCode === 13){
        login();
    }
};

let info = new Vue({
    el: '#info',
    data:{
        info: null
    }
});

let question = new Vue({
   el: '#question',
   data:{
       question: null
   }
});

let btnLogin = new Vue({
    el: '#btnLogin',
    methods: {
        login: login
    }
});

let done = function(){
    warp.loadStart();
    setTimeout(function(){warp.loadDone()}, 500);
};

let makeVoteMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "inline";
    document.getElementById("info").style.display = "none";

    info.info = null;

    done();
};

let makeLoadingMode = function(){

    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";
    info.info = MSG_LOADING;

    warp.loadStart();
};

let makeCompleteMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";

    info.info = MSG_COMPLETE;

    done();
};

let makeWaitMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";

    info.info = MSG_WAIT;

    done();
};

let makeSigningMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";

    info.info = MSG_SIGNING;

    warp.loadStart();
};

let makeEndMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";

    info.info = MSG_END;

    done();
};

let makeVotingMode = function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "flex";

    info.info = MSG_VOTING;

    done();
};

let makeSignMode = function(){
    document.getElementById("login").style.display = "flex";
    document.getElementById("vote").style.display = "none";
    document.getElementById("info").style.display = "none";

    input_studentNum.studentNum="";
    info.info = null;

    done();
};

makeLoadingMode();


let main = function(user){


    let uid = user.uid;

    let btnRef = firebase.database().ref('mask/setting/btn');
    let questionRef = firebase.database().ref('mask/setting/question');
    let statusRef = firebase.database().ref('mask/users/'+uid+'/status');
    let isVotingRef = firebase.database().ref('mask/isVoting');
    let settingRef = firebase.database().ref('mask/setting');
    let eventRef = firebase.database().ref('mask/users/'+uid+'/event');

    let isVoted = null;
    let isVoting = null;

    let setMode = function(){
      if(isVoting){
          if(isVoted){
              makeCompleteMode();
          } else if (!isVoted){
              makeVoteMode();
          }
      } else if(!isVoting) {
          if(isVoted){
              makeEndMode();
          } else if (!isVoted){
              makeWaitMode();
          }
      }
    };

    settingRef.on('value', function(snapshot){
        let previous = String(document.getElementById("vote").style.display);
        document.getElementById("vote").style.display = "inline";

        question.question = snapshot.child('question').val();

        let length = button.btns.length;
        for(let i = 0; i<length; i++){
            button.btns.pop();
        }



        snapshot.child('btn').forEach(function(child){
            button.btns.push({
                id: child.child('id').val(),
                name: child.child('name').val()
            });
        });

        Vue.nextTick().then(function(){
            let elements = document.getElementsByClassName("btns");
            let num = elements.length;
            document.getElementById("btnVote").style.height = (num*10) + "%";
            document.getElementById("question").style.height = (100-(num*10)) + "%";
            for(let i=0; i<num; i++){
                elements[i].style.height = (100/num) + "%";
            }
            document.getElementById("vote").style.display = previous;
        });

    });

    eventRef.on('value',function(snapshot){

       if(snapshot.val() === true){
           document.getElementById("event").style.display = "flex";

           /*let audio = new Audio();
           if(Math.random()<0.5)
                audio.src = "./src/music/popstar.mp3";
           else
                audio.src = "./src/music/yesoryes.mp3";

           audio.play();*/

           if(navigator.vibrate){
               window.navigator.vibrate([1000,100,1000,100,1000,100,1000]);
           }
       } else {
           document.getElementById("event").style.display = "none";
           if(navigator.vibrate){
               window.navigator.vibrate(0);
           }
       }
    });

    statusRef.on('value', function(snapshot){
        isVoted = snapshot.val();
        setMode();
    });

    isVotingRef.on('value', function(snapshot){
        isVoting = snapshot.val();
        setMode();
    });

    let button = new Vue({
        el: '#btnVote',
        data:{
            btns:[
                {
                    id: 0,
                    name:"Loading..."
                }
            ]

        },
        methods:{
            select: function(name, event){
                setTimeout(function(){
                    if(confirm(name+'에 투표하시겠습니까?') === true){
                        makeVotingMode();
                        firebase.database().ref('mask/voting/'+name).transaction(function(snapshot){
                            if(snapshot){
                                snapshot++;
                            } else {
                                snapshot=1;
                            }
                            return snapshot;
                        })
                            .then(function(){
                                makeCompleteMode();
                                statusRef.set(true)
                            })
                            .catch(function(reject){
                                snack('오류가 발생했습니다. 다시 시도해주세요..ㅠ\n'+reject)
                            })
                    } else {
                        [].forEach.call(document.getElementsByClassName("select"),function(el){

                        });
                    }
                },250);

            }
        }
    });


};


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        makeLoadingMode();
        firebase.database().ref('mask/users/'+user.uid+'/num').once('value', function(snapshot){
            snack(snapshot.val() + '님, 환영합니다.');
            main(user);
        }).catch(function(error){
            snack('오류가 발생하였습니다. 다시 시도해주세요.\n'+error.message)
        });
    } else {
        makeSignMode()
    }
});