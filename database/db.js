import loki from "lokijs";

export const db = new loki("./cafe.db", {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000,
});

function databaseInitialize() {
  const users = db.getCollection("users");
  if (users === null) {
    db.addCollection("users");
  }
  const menus = db.getCollection("menus");
  if(menus===null){
    db.addCollection("menus");
  }
  
  runProgramLogic();
}


function runProgramLogic() {
  var userCount = db.getCollection("users").count();
  var menuCount = db.getCollection("menus").count();
  console.log("number of users in database : " + userCount);
  console.log("number of menus in database : " + menuCount);
}

export const insertUser=(email,password)=>{
    const users=db.getCollection("users");
    const result=users.insert({email,password});
    console.log("insert result:",result);
    console.log(result);
    return result;
};

export const findUserByEmail=(email) =>{
    const users=db.getCollection("users"); //db에 있는 users 정보를 싹다 수집 
    const user=users.findOne({email});  // 들어온이메일이랑 db에 있는 email같은 것을 찾아준 것을 내보냄
    return user;
};

export const insertMenu=(MenuName,MenuImg,MenuPrice)=>{
  const menus=db.getCollection("menus");
  const MenuResult=menus.insert({MenuName,MenuImg,MenuPrice});
  console.log("insert Menu:",MenuResult);
  console.log(MenuResult);
  return MenuResult;
};

export const findMenuByName=(MenuName) =>{
  const menus=db.getCollection("menus");
  const menu=menus.findOne({MenuName});
  return menu;
};




