import express from 'express';
import path from 'path';
import { db,findUserByEmail, insertUser, insertMenu} from './database/db.js';
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import formidable from "formidable";
import { existsSync, mkdirSync } from "fs";

const app = express(); //express 프레임워크 사용!
const uploadDir = "uploads";

if (!existsSync(uploadDir)) {
  console.log( `making upload directory ${uploadDir}…`);
  mkdirSync(uploadDir, { recursive: true });  //파일 업로드를 위한 디렉토리인 "uploads"가 존재하는지 확인하고, 없다면 해당 디렉토리를 생성합니다. existsSync 함수는 파일 또는 디렉토리의 존재 여부를 확인합니다.
}
// 정적 파일 제공 설정
app.use(express.static(path.resolve("public"))); 
app.use('/uploads', express.static(path.resolve(uploadDir)));//Express의 static 미들웨어를 사용하여 정적 파일을 제공하는 설정입니다. public 디렉토리의 내용은 루트 URL에서, 그리고 uploads 디렉토리의 내용은 "/uploads" URL에서 접근할 수 있게 합니다. 이를 통해 이미지나 CSS 파일 등의 정적 자원을 클라이언트에게 제공할 수 있습니다.

const USER_COOKIE_KEY="USER";
app.use(express.static(path.resolve("public"), {extensions: ["html"]}));
app.use(cookieParser());
app.use(express.json());  //cookieParser를 사용하여 쿠키를 파싱하고, express.json()을 사용하여 클라이언트에서 전송된 JSON 데이터를 파싱합니다. 이를 통해 클라이언트의 쿠키와 JSON 데이터를 서버에서 쉽게 다룰 수 있습니다.

app.get('/', (req, res) => {
  
});  


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const Euser=findUserByEmail(email); //불린 null이면 false이다 
  
  if(!Euser) {
    return res.send({
      loginSuccess : false,
      message :"존재하는 이메일이 아닙니다."
    });
  }
  else {
    const validPassword= await bcrypt.compare(password,Euser.password);  //암호화된 비밀번호랑 입력된 비밀번호를 비교 ! validpassword 불린
    // console.log(validPassword);
    if(!validPassword){ 
      return res.send({
        loginSuccess : false,
        message : "비밀번호가 틀립니다."
      })

    }
    else {
      res.cookie(USER_COOKIE_KEY,JSON.stringify(Euser)); //res.cookie(쿠키이름,쿠키값) 쿠키 만들어준다
      return res.send({
        loginSuccess : true,
        message : "로그인 성공!"
      });
      }; 
  }
  
});

//signup.js에서 fetch로 보낸 요청(req)들을 여기 서버에서 관리함! 서버입장에서는 요청이옴 그래서 signup.js에서 보낸것들을 req로 받아옴
app.post('/signup', async (req, res) => {
  const { email, password } = req.body; //signup.js body에서 가지고있고, 보내 진것들을 여기서 서버입장에서 사용하려고함
  console.log(req.body);
  console.log('email', email, 'pass', password);
  const fuser = findUserByEmail(email); //그것을 다시 변수 fuser로 받아줌
  console.log(fuser);
  if (fuser){
    console.log("이미 존재하는 아이디 입니다.")
    return res.status(422).send(`${email}가 이미 존재하는 이메일 입니다.`) //422에러를 보내줌 
  }
  
    console.log("회원 가입 가능 : " , req.body.password);
    const hash = await bcrypt.hash(password,10); //bcrypt 모듈에서 hash 함수를 이용해 비밀번호 암호화 진행! await 좀 기다려!
    const result = insertUser(email, hash);
    console.log('result insert:', result);
    // res.cookie(USER_COOKIE_KEY,JSON.stringify(result)); //회원가입할때쿠키 생성 필요 x
    res.json(result);
  
});

app.get('/getMenus', (req, res) => {
  // 데이터베이스에서 메뉴 데이터를 읽어옴
  const menus = db.getCollection("menus").data;

  // 클라이언트에 메뉴 데이터를 JSON 형태로 응답
  res.json(menus);
});


app.post("/admin", async (req, res) => {
  try {
    const form = formidable({ uploadDir: uploadDir });
    const [fields, files] = await form.parse(req); //자바스크립트 객체변환

    // 데이터베이스에 추가하는 로직
    const MenuName = fields.name;
    const MenuPrice = fields.price;
    const imageFilename = files.image[0].newFilename;
    const MenuImg = imageFilename ? `uploads/${imageFilename}` : null;
    console.log(
      "files data",
      files.image[0].newFilename, //332323212312업로드 파일에 있는 이름
      files.image[0].originalFilename //아메리카노.jpg
    );
    // insertMenu 함수를 사용하여 데이터베이스에 추가
    const MenuResult = insertMenu(MenuName, MenuImg, MenuPrice);

    res.send({
      success: true,
      message: "메뉴가 성공적으로 추가되었습니다.",
      menu: MenuResult,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
//:각각
app.put('/updateMenu/:menuName', async (req,res) =>{
  const {currentMenuName,newName, newPrice} = req.body;
  console.log(currentMenuName,newName, newPrice)
  const menus = db.getCollection("menus").data;
  const menusCollection = db.getCollection("menus");
  const menuToUpdate = menus.find(menu => menu.MenuName[0] === currentMenuName); //db의 menuname은 array형식으로 들어옴 그것의 0번째는 스트링, 그리고 현재 메뉴네임은 그냥 스트링 
  console.log('ㅁㅁㅁ',menuToUpdate)

  if(menuToUpdate){
// 만약 MenuName이 배열이라면, 새 배열로 업데이트
    if (Array.isArray(menuToUpdate.MenuName)) {
      menuToUpdate.MenuName = [newName];  // 새 배열로 교체
    } else {
      menuToUpdate.MenuName = newName;  // 문자열일 경우 그대로 대체
    }
    // 만약 MenuName이 배열이라면, 새 배열로 업데이트
    if (Array.isArray(menuToUpdate.MenuPrice)) {
      menuToUpdate.MenuPrice = [newPrice];  // 새 배열로 교체
    } else {
      menuToUpdate.MenuPrice = newPrice;  // 문자열일 경우 그대로 대체
    }


    menusCollection.update(menuToUpdate); //db update라는 함수를 써서 db에 수정
    console.log(menusCollection.data);
    res.json({ success: true, message: '메뉴가 성공적으로 수정되었습니다.' });
  } else {
    res.status(404).json({ success: false, message: '메뉴를 찾을 수 없습니다.' });
  }
})

app.delete('/deleteMenu/:menuName', async (req, res) => {
  const menuName = req.params.menuName; //:id라는 것이 있을 때, req.params.id로 불러온다
  const menus = db.getCollection("menus").data;
  const menusCollection = db.getCollection("menus");
  console.log('menuName',menuName,'menus',menus)

  // 메뉴 찾기
  const menuToDelete = menus.find(menu => menu.MenuName[0] === menuName); //db 에서 찾는 함수 
  console.log('ㅁㅁㅁ',menuToDelete)

  if (menuToDelete) {
    // 메뉴 삭제
    menusCollection.remove(menuToDelete);

    res.json({ success: true, message: '메뉴가 성공적으로 삭제되었습니다.' });
  } else {
    res.status(404).json({ success: false, message: '메뉴를 찾을 수 없습니다.' });
  }
});

app.get('/logout',(req,res)=>{
  res.clearCookie(USER_COOKIE_KEY).redirect('/');
});

app.listen(3000, () => {
  console.log('app server is running on port 3000');
});
