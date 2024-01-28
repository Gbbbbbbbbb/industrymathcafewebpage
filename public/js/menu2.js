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
    let selectedMenus = [];

    menuData.forEach(menu => {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-card';
        menuDiv.innerHTML = `
            <h2>${menu.MenuName}</h2>
            <p>가격: ${menu.MenuPrice}</p>
            <img src="${menu.MenuImg}" alt="${menu.MenuName}">
            <button onclick="showEditForm('${menu.MenuName}', ${menu.MenuPrice})">메뉴 수정하기</button>
            <button onclick="deleteMenu('${menu.MenuName}')">메뉴 삭제하기</button>
        `;

        menuDiv.addEventListener('click', () => {
            
            const index = selectedMenus.findIndex(selectedMenu => selectedMenu.MenuName === menu.MenuName);

            if (index === -1) {
             
                menu.quantity = 1;
                selectedMenus.push(menu);
            } else {
              
                selectedMenus[index].quantity = (selectedMenus[index].quantity || 1) + 1;
            }

            
            updateSelectedMenus(selectedMenus, menuDetailsDiv);
        });

        menuListDiv.appendChild(menuDiv);
    });
}

function updateSelectedMenus(selectedMenus, menuDetailsDiv) {
    let totalPrice = 0;

    // Update the menu details

    selectedMenus.forEach(menu => {
        const menuPrice = parseInt(menu.MenuPrice, 10); // Convert menu price to integer
        const subtotal = menuPrice * menu.quantity;

    });

}

function showEditForm(menuName, menuPrice) {
    document.getElementById('editMenuName').value = menuName;
    document.getElementById('currentMenuName').value = menuName;
    document.getElementById('editMenuPrice').value = menuPrice;
    document.getElementById('edit-form').style.display = 'block';
}
async function editMenu(menuName) {
    const currentMenuName = document.getElementById('currentMenuName').value;
    const newName = document.getElementById('editMenuName').value;
    const newPrice = document.getElementById('editMenuPrice').value;


    //각각의 메뉴 네임 아메리카노 선택했어 메뉴 수정하기 버튼
    try {
        const response = await fetch(`/updateMenu/${menuName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentMenuName,
                newName,
                newPrice,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            console.log(data.message);
            
            cancelEdit();
            location.reload(); // 새로고침
        } else {
            console.error(data.message);
        
        }
    } catch (error) {
        console.error('Error updating menu:', error);
        
    }
}

async function deleteMenu(menuName) {
    try {
        const response = await fetch(`/deleteMenu/${menuName}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
            // 삭제 성공 시 새로고침
            location.reload();
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('메뉴 삭제 중 에러 발생:', error);
    }
}
  

function cancelEdit() {
    document.getElementById('edit-form').style.display = 'none';
}
