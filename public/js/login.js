const form= document.querySelector("form");
const email=document.querySelector("input[type=email]")
const password=document.querySelector("input[type=password]")



form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const emailValue=email.value;
    const passwordValue=password.value;
    console.log(emailValue,passwordValue);
    const resp =await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            email:emailValue,
            password:passwordValue
        }),
        
    });
    const logindata= await resp.json(); //resp: fetch 함수로부터 반환된 Promise가 해결(resolve)되면, 해당 응답(response) 객체, resp.json()은 fetch 함수로부터 받은 응답 본문을 JSON 형식으로 해석하는 비동기 함수 비동기작업은 시간이 오래걸리는 작업 동기적으로 처리하면 다른 코드의 실행들을 막기도 있을 수도 있기때문에
    const logdata=JSON.stringify(logindata);
    const logObjData=JSON.parse(logdata);    //JSON 객체를 자바스크립트 객체로 변환! parse 구문분석 같은 것

    if(logObjData.loginSuccess==false){
        const errorMessage=document.querySelector(".errormessage");
        errorMessage.innerHTML=logObjData.message;
    }
    if(logObjData.loginSuccess==true){
        const errorSuccess=document.querySelector(".errorsuccess");
        errorSuccess.innerHTML=logObjData.message;
        window.location.href="index.html";
    }

    
    
});