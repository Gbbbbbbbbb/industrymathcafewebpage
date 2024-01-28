
let selectedMenus = [];  //array 선언

//html 문서가 로드 되었을때 event발생
document.addEventListener("DOMContentLoaded", function () {
    fetchMenuData();
});

async function fetchMenuData() {
    try {
        const response = await fetch('/getMenus'); 
        const menuData = await response.json();
        displayMenuData(menuData);
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

function displayMenuData(menuData) {
    const menuListDiv = document.getElementById('menu-list');
    const menuDetailsDiv = document.getElementById('menu-details');

    //메뉴 1개1개마다 반복
    menuData.forEach(menu => {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-card'; //classname 을 메뉴카드로 만듬
        menuDiv.innerHTML = `
            <h2>${menu.MenuName}</h2>
            <p>가격: ${menu.MenuPrice}</p>
            <img src="${menu.MenuImg}" alt="${menu.MenuName}"> 
        `;
//div로 만들어주고 클래스네임 menu-card로 지정 html 에 설정 
        menuDiv.addEventListener('click', () => {
            
            const index = selectedMenus.findIndex(selectedMenu => selectedMenu.MenuName === menu.MenuName); // 선택된 메뉴의 index찾기
                     //선택된 메뉴가 아니라면 양을 1로 놔두고 새로추가 
            if (index === -1) {
                
                menu.quantity = 1;
                selectedMenus.push(menu);
            } else {
               
                selectedMenus[index].quantity = (selectedMenus[index].quantity || 1) + 1; //양을 +1해라!
            }

       
            updateSelectedMenus();

            // Show "주문하기" button if there are items in the order
            showOrderButton();
        });

        menuListDiv.appendChild(menuDiv); //자식요소로 만들어줌
    });

    // Initially hide the "주문하기" button
    menuDetailsDiv.innerHTML = '';
    showOrderButton();
}

function updateSelectedMenus() {
    let totalPrice = 0;

    // Get a reference to menuDetailsDiv
    const menuDetailsDiv = document.getElementById('menu-details');

    // Update the menu details
    menuDetailsDiv.innerHTML = '<h2>주문서</h2>';

    selectedMenus.forEach((menu, index) => {
        const menuPrice = parseInt(menu.MenuPrice, 10); // Convert menu price to integer
        const subtotal = menuPrice * menu.quantity;

        menuDetailsDiv.innerHTML += `
            <div class="selected-menu-item">
                <p>
                    ${menu.MenuName} - ${menuPrice}원 x ${menu.quantity} = ${subtotal}원
                    <button class="delete-btn" onclick="removeMenu(${index})">삭제</button>
                </p>
            </div>
        `;
        totalPrice += subtotal;
    });

    // Display the total price
    menuDetailsDiv.innerHTML += `
        <p><strong>총 가격: ${totalPrice}원</strong></p>
    `;
}

function removeMenu(index) {
    selectedMenus.splice(index, 1);  //특정 인덱스의 요소를 제거하는 메서드입니다. splice
    updateSelectedMenus();

   
    showOrderButton();
}

function showOrderButton() {
    const menuDetailsDiv = document.getElementById('menu-details');
    const orderButton = document.getElementById('order-button');

    
    if (selectedMenus.length > 0) {
        if (!orderButton) {
            const newOrderButton = document.createElement('button'); //button 만들기
            newOrderButton.id = 'order-button'; //id 만들어주기
            newOrderButton.textContent = '주문하기'; //주문하기 버튼
            newOrderButton.addEventListener('click', placeOrder);
            menuDetailsDiv.appendChild(newOrderButton);//새로 생성한 주문 버튼을 주문 내역을 표시하는 영역인 menuDetailsDiv(주문서)에 추가합니다.
        }
    } else {
        if (orderButton) {
            orderButton.remove();
        }
    }
}

function placeOrder() {
    
    alert('주문이 완료되었습니다!');
    
    // 주문이 완료되면 index.html로 이동
    window.location.href = 'index.html';
    
    // 주문이 완료되면 selectedMenus를 초기화하거나 필요에 따라 다른 작업을 수행하세요.
    selectedMenus = [];
    updateSelectedMenus();

    showOrderButton();
}
