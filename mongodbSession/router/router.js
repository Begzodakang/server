const { Router, request } = require("express");
const { uploadImg, uploadVideo, uploadOthers } = require("../utils/multer");
const router = Router();
const fs = require("fs")
const path = require("path")
const {
  registerStudent,
  sentStudentDataToDB,
  profileStudent,
  newCourseByFrontEnd,
} = require("../controller/sctudentRegister");
const avatarUploadStudent = require("../controller/studentAvatar");
const studentSchema = require("../module/Registerschema");
const ticherShema = require("../module/ticherShema");
const menejerSchema = require("../module/menejerSchema");
const avatarUpload = require("../controller/studentAvatar");
const { loginTicher } = require("../controller/login");
const { studentLogin } = require("../controller/studentLogin");
const {
  ticherProfile,
  TicherYoqlama,
  TichersendMessage,
  TicherBaho,
} = require("../controller/ticherController");
const { 
  menejerPost, 
  menejerGet , 
  menejerFilter,
  filterTolov ,
  sendMessageMenejer
} = require("../controller/menejer");
const oy = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

router.get("/", (req, res) => {
  if (req.session.islogged == true) {
    if (req.session.student) {
      res.redirect("/profile/student");
    } else {
      res.redirect("/profile/ticher");
    }
  } else {
    res.render("home", {
      title: "home page",
      style: [{ href: "style/homestyle.css" }],
      URL: process.env.URL,
    });
  }
});
/*
    PATH  STUDENT/REG        metod get
    describe ==>     registratsiya uchun
*/
router.get("/student/reg/:category", registerStudent);

/*
    PATH  course/category/add/student        metod post
    describe ==>     registratsiya uchun
*/
router.post(
  "/course/:category/add/student",
  uploadImg.single("doc"),
  sentStudentDataToDB
);
/*
    PATH   /profile/student       metod get
    describe ==>     profileni qaytarish uchun
*/

router.get("/profile/student", profileStudent);

/*
    PATH   /profile/student/avatarstudent       metod POST
    describe ==>     sudentni avatar yuklash uchun
*/

router.post(
  "/profile/student/avatarstudent",
  uploadImg.single("avatarStudent"),
  avatarUpload
);

/*
    PATH   /profile/student/logout       metod get
    describe ==>     profiledan chiqish
*/
router.get("/profile/student/logout", (req, res) => {
  req.session.islogged = false;
  req.session.student = false;
  req.session.save((err) => {
    if (err) throw err;
  });
  console.log(req.session.student);
  res.send("ok");
});

/*
    PATH   /404       metod get
    describe ==>     xatolik uchun
*/

router.get("/404", (req, res) => {
  res.render("404", {
    title: "404",
    URL: process.env.URL,
    style: [{ href: "style/404.css" }],
  });
});

/*
    PATH   /profile/student/newcourse       metod POST
    describe ==>     yangi kus uchun
*/

router.post("/profile/student/newcourse", newCourseByFrontEnd);

/*
    PATH   /login/  metod GRT
    describe ==>     login page
    
*/

router.get("/login", (req, res) => {
  res.render("login", {
    URL: process.env.URL,
    title: "login",
    style: [{ href: "style/login.css" }],
  });
});

/*
    PATH   /login/student/  metod POST
    describe ==>     ustozni tekshirish uchun 
*/
router.post("/login/student", studentLogin);
/*
    PATH   /login/ticher/  metod POST
    describe ==>     ustozni tekshirish uchun 
*/
router.post("/login/tichers", loginTicher);
/*
    PATH   /profile/ticher/  metod GRT
    describe ==>     ustoz profileini berish
*/

router.get("/profile/tichers", ticherProfile);

/*
    PATH   /profile/ticher/avatar  metod POST
    describe ==>     ustoz avatarini yangilash
*/
router.post("/profile/tichers/avatar",
  uploadImg.single("tichers"),
  async (req, res) => {
    const avatar = {
      avatar: process.env.URL + "uploads/images/" + req.file.filename,
    };
    const ticher = await ticherShema.findByIdAndUpdate(req.session.ticher._id, {
      avatar: avatar.avatar,
    });
    res.send(avatar);
  }
);

/*
    PATH   /profile/tichers/studentData/:id  metod get
    describe ==>     oquvchini bazadan Olish
*/

router.get("/profile/tichers/studentData/:id", async (req, res) => {
  if (req.session.isloggedTicher || req.session.menejerLogged) {
    const student = await studentSchema.findById(req.params.id);
    res.send(student);
  }
});

/*
    PATH   /profile/tichers/yoqlama  metod Post
    describe ==>    oquvchini yoqlama qilish
*/

router.post("/profile/tichers/yoqlama", TicherYoqlama);

/*
    PATH   /profile/tichers/logout  metod Post
    describe ==>    oquvchini yoqlama qilish
*/
router.post("/profile/tichers/logout", (req, res) => {
  if (req.session.isloggedTicher && req.body.status == false) {
    req.session.isloggedTicher = false;
    req.session.save((e) => {
      if (e) throw e;
    });
    res.send({ status: true });
  }
});

/*
    PATH   /profile/tichers/sendmessage  metod Post
    describe ==>    oquvchi sahifasiga habar yuborish
*/

router.post("/profile/tichers/sendmessage", TichersendMessage);

/*
    PATH   /profile/tichers/baho  metod Post
    describe ==>    oquvchi sahifasiga habar yuborish
*/

router.post("/profile/tichers/baho", TicherBaho);

/*
    PATH   /profile/tichers/filter/yonalish  metod POST
    describe ==>    yonalishi boyicha filterlash
*/
router.post("/profile/tichers/filter/yonalish", async (req, res) => {
  if (req.session.isloggedTicher == true) {
    const students = (await studentSchema.find().lean()).filter((st) => {
      const category = st.category.map((c) => c.name);
      if (category.includes(req.body.course) && st.acceptance) {
        return st;
      }
    });
    res.send(students);
  } else {
    res.send({ message: "err" });
  }
});

/*
    PATH   /profile/student/baho/:course  metod post
    describe ==>    oquvchiga bahosini yuborish
*/
router.get("/profile/student/baho/:course", async (req, res) => {
  if (req.session.islogged) {
    const student = await studentSchema.findById(req.session.student._id);
    const baho = student.category.filter(
      (cours) => cours.name == req.params.course
    );
    res.send(baho);
  } else {
    res.send({ message: "status togri kelmadi" });
  }
});

/*
    PATH   /menejer  metod GET
    describe ==>    menejer login || profile
*/

router.get("/menejer", menejerGet);

/*
    PATH   /menejer  metod Post
    describe ==>    menejer profile confirm
*/

router.post("/menejer", menejerPost);

/*
    PATH   /menejer/logout  metod Post
    describe ==>    menejer profile logout
*/

router.post("/menejer/logout", (req, res) => {
  if (req.session.menejerLogged == true) {
    req.session.menejerLogged = false;
    req.session.save((e) => {
      if (e) throw e;
    });
    res.send({ message: "ok" });
  } else {
    res.send({ message: "err" });
  }
});

/*
    PATH   /menejer/filter/tichers  metod Post
    describe ==>    oquvchilarni uztoz boyicha filterlash
*/

router.post("/menejer/filter/ticher", menejerFilter);

/*
    PATH   /menejer/filter/tolov  metod Post
    describe ==>    oquvchilarni tolov boyicha filterlash
    
*/

router.post("/menejer/filter/tolov" , filterTolov)

/*
    PATH   /menejer/sendmessage  metod Post
    describe ==>    oquvchilarga habar yuborish
    
*/

router.post("/menejer/sendmessage" , sendMessageMenejer)


/*
    PATH   /menejer/tolov  metod Post
    describe ==>    oquvchini tolovini qoshish 
    
*/

router.post("/menejer/tolov" , async (req, res)=>{
  if(req.session.menejerLogged){
    const student = await studentSchema.findById(req.body.target)
    student.category.forEach(s=>{
      if(s.name == req.body.cours){
        s.oylik = true
      }
    })
    student.messageByTeacher.push({
      messageText:req.body.cours +" kursiga tolov qilindi",
      status: "success",
      teacher: "menejer",
      statusMessage: "tolov",
      vaqt: `${new Date().getDate()} ${
        oy[new Date().getMonth() - 1]
      }<br> ${new Date().getHours()}:${
        new Date().getMinutes() > 9
          ? new Date().getMinutes()
          : "0" + new Date().getMinutes()
      }`,
    });

    await studentSchema.findByIdAndUpdate(student._id , {category:student.category})
    await studentSchema.findByIdAndUpdate(student._id , {messageByTeacher:student.messageByTeacher})
    res.send({message:"tolov yozildi"})
  }
})

/*
    PATH   /menejer/tasdiq/student  metod Post
    describe ==>    oquvchini qabul qilishlik 
*/

router.post("/menejer/tasdiq/student" , async (req, res)=>{
  if(req.session.menejerLogged){
    await studentSchema.findByIdAndUpdate(req.body.student , {acceptance:true})
    res.send({message:"muvofaqiyatli royhatdan otkazildi"})
  }
})
// reset  student
router.get("/menejer/reset" , async (req, res)=>{
  if(req.session.menejerLogged){
    const students = await studentSchema.find().lean()
    students.forEach(async student=>{
      student.category.forEach(cours=>{
        cours.oylik = false
      })

      await studentSchema.findByIdAndUpdate(student._id , {category:student.category})

    })
    res.send({message:"hamma oquvchi oylilari boshlanish holatiga otdi"})
  }
})

/*
    PATH   /menejer/remove  metod Post
    describe ==>    oquvchini ochirish 
*/

router.post("/menejer/remove" , async (req, res)=>{
  if(req.session.menejerLogged){
    const student = await studentSchema.findByIdAndRemove(req.body.id)
    const url = new URL(student.avatar)
    const urlDoc = new URL(student.doc)
    fs.rm(path.join(__dirname,"../public" , urlDoc.pathname) , (err)=>{if(err) throw err})
    if(process.env.URL == url.origin+"/"){
      fs.rm(path.join(__dirname,"../public" , url.pathname) , (err)=>{if(err) throw err})
    }
    res.send({message:student.name+" bazadan ochirildi"})
  }else{
    res.send({err:"siz menejer emassiz"})
  }
})
module.exports = router;
