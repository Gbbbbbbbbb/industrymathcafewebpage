
  const signupForm = document.querySelector("form");

  // async 는 비동기처리 방식이다. 프라미스 결과를 아직 반환하지 않는 객체, 코드는 실행 되었지만 결과를 아직 반홚지 않는 객체이다.
  // 프라미스의 종류에는 3가지 대기, 실패, 이행 then method catch method async는 함수를 선언할 때 붙이고, await는 이행에서 실패가 될떄까지 기다리고 선언하는 함수이다. error핸들링을 쉽게하기 위해서 사용함.
  signupForm.addEventListener("submit", async function (event) {     
    event.preventDefault(); //새로고침!
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const password2 = document.querySelector("#password2").value;

    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (password !== password2) {
      const errorElement = document.querySelector(".error");
      if (errorElement) {
        errorElement.innerHTML = "비밀번호가 일치하지 않습니다.";
      }
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/; //특수문자가 들어간 정규표현식

    if (!passwordRegex.test(password)) {
      const errorElement = document.querySelector(".error");
      if (errorElement) {
        errorElement.innerHTML = "비밀번호는 최소 8자 이상이어야 하며, 대소문자 및 숫자를 포함해야 합니다.";
      }
      return;
    }
      //fetch 매서드는 JavaScript에서 서버로 네트워크 요청을 보내고 응답을 받을 수 있도록 해주는 매서드이다.HTTP 요청을 전송할 URL과 요청 메소드 헤드 바디를 설정한다.
      // POST 새로운 자원 생성 요청 ,GET은 존재하는 자원 요청 ,delete는 존재하는 자원 삭제요청, PUT은 존재하는 자원 변경 요청
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
        //response.ok는 fetch 함수로 서버로부터 받은 응답(response)의 성공여부를 나타내는 프러퍼티다! 이것은 불린이다!
      if (!response.ok) {
        const errorElement = document.querySelector(".error");
        if (errorElement) {
          errorElement.innerHTML = "회원가입에 실패했습니다.";
        }
        throw new Error("회원가입에 실패했습니다."); //예외처리를 함 바로 catch로 넘어감
      }

      const data = await response.json(); //response.json()은 fetch 함수를 사용하여 서버에서 받은 HTTP응답의 내요을 JSON형식으로 해석하는 비동기 함수이다. await 키워드는 async 함수 내에서만 사용할수있으며, 해당함수가 완료될때까지 기다리는 역할 그결과르 변수 data에 할당!
      console.log("회원가입 성공:", data);

      // 회원가입 성공 시 로그인 페이지로 이동
      window.location.href = "index.html";
      
    } catch (error) {
      console.error("회원 가입 에러 : ",error.message); //요청이 안갔거나, 응답이 똑바로 안왔을떄 예외처리발생한 것들의 에러를 보여줌
    }
  });

