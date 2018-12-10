# Realtime Vote System (on Working!)
Firebase를 이용한 실시간 투표 시스템입니다. 실제로 이용할 때에는 아래와 같은 fbInit.js 파일을 작성하여 포함해주세요. admin과 client 모두 필요합니다.
```
document.getElementById("login").style.display = "none";
document.getElementById("vote").style.display = "none";
let config = {
    ......
};
firebase.initializeApp(config);
```
config는 https://firebase.google.com/docs/web/setup 를 참조해주세요.
