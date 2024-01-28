//DOMContentLoaded는 index.html이 로드될때, Event 발생!

document.addEventListener("DOMContentLoaded", function () {
    // 쿠키 확인
    const hasCookie = checkCookie();

    // 버튼을 보여주거나 숨김
    showAuthButtons(hasCookie);
});

// 쿠키 확인 함수
function checkCookie() {
    const cookies = document.cookie.split('=');
    console.log(cookies)

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); //문자열 양끝 공백제거 trim
        if (cookie.startsWith('USER')) {
            return true; // 쿠키가 존재하면 true 반환
        }
    }

    return false; // 쿠키가 없으면 false 반환
}

// 버튼을 보여주거나 숨기는 함수
function showAuthButtons(hasCookie) {
    const authButtonsDiv = document.getElementById('auth-buttons');
    if (hasCookie) {
        // 쿠키가 있을 경우: 로그아웃 버튼 보이기
        authButtonsDiv.innerHTML = `<a href="/logout">로그아웃 &nbsp </a>
                                    <a href="menu.html">주문하기 &nbsp </a>
                                    `;
        
    } else {
        // 쿠키가 없을 경우: 로그인 및 회원가입 버튼 보이기
        authButtonsDiv.innerHTML = `
            <a href="login.html">로그인&nbsp</a>
            <a href="signup.html">회원가입 &nbsp</a>
        `;
    }
}
