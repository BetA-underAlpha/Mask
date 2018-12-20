# Realtime Vote System (on Working!)
Firebase를 이용한 실시간 투표 시스템입니다.

##Addtionally Needed Settings
###fbInit.js
fbInit.js 파일을 아래와 같이 작성하여 client와 admin 모두 포함시켜주세요.
```
document.getElementById("login").style.display = "none";
document.getElementById("vote").style.display = "none";
let config = {
    ......
};

let adminURL = [YOUR PERSONAL ADMIN PAGE URL]
firebase.initializeApp(config);
```
config는 https://firebase.google.com/docs/web/setup 를 참조해주세요.

###Firebase 보안규칙
보안을 위해 Firebase Realtime Database 보안규칙을 설정해주세요. 아래는 예시입니다.
```
{
  "rules": {
    "mask":{
      ".read":"auth!=null",
      ".write":"auth.uid === '[ADMIN FIREBASE AUTH UID]'",
      "users":{
        ".read":"true",
        ".write": "auth!=null",
        "$uid":{
          ".write":"$uid === auth.uid"
        }
      },
      "voting":{
        ".write":"auth != null"
      }
    }
  }
}
```
