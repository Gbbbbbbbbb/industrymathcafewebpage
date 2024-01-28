const addImage = (url, element) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.responseType = 'blob'
  
    request.addEventListener('load', () => {
      if (request.status == 200) {
        const response = request.response
        const blob = new Blob([response], {type: 'image/png'})
        const img = document.createElement('img')
        img.src = window.URL.createObjectURL(blob)

        img.classList.add('test');

        element.appendChild(img)
      } else {
        console.log(`${request.status}: ${request.statusText}`);
      }
    })
    request.addEventListener('error', event => console.log('Network error'))
    request.send()
  }

  const imageDiv = document.getElementById("root");
  
// 이미지를 담을 가로 행을 만듭니다.
const imageRow = document.createElement("div");
imageRow.id = "imageRow";
imageRow.style.display = "flex";

const urls = [
  "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/12/08/02/59/benches-560435_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/04/03/12/05/tree-99852_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/02/20/11/30/autumn-83761_1280.jpg"
];

// 이미지를 가로 행에 추가합니다.
urls.forEach((url) => {
  const divElm = document.createElement("div");
  addImage(url, divElm);
  imageRow.appendChild(divElm);
});

// 가로 행을 루트 요소에 추가합니다.
imageDiv.appendChild(imageRow);