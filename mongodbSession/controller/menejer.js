const menejerSchema = require("../module/menejerSchema");
const studentSchema = require("../module/Registerschema");
const ticherShema = require("../module/ticherShema");
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
const menejerPost = async (req, res) => {
  const menejer = (await menejerSchema.find())[0];
  if (
    menejer.login == req.body.login &&
    menejer.password == req.body.password
  ) {
    req.session.menejer = menejer;
    req.session.islogged = false;
    req.session.isloggedTicher = false;
    req.session.menejerLogged = true;
    req.session.save((e) => {
      if (e) throw e;
    });
    res.send({ status: "ok" });
  } else {
    res.send({ status: "err" });
  }
};

const menejerGet = async (req, res) => {
  if (req.session.menejerLogged == true) {
    const students_acc = (await studentSchema.find().lean()).filter(
      (student) => student.acceptance == true
    );
    students_acc.forEach(student=>{
      const oylik = student.category.filter(c=>c.oylik == false)
      student.oylik = oylik.length ==0?true:false
    })
    console.log(students_acc);

    const students_notAcc = (await studentSchema.find().lean()).filter(
      (student) => student.acceptance == false
    );

    const mutahasislar = await ticherShema.find().lean()
    res.render("menejer", {
      title: "menejer",
      URL: process.env.URL,
      style: [{ href: "style/menejer.css" }, { href: "style/tichers.css" }],
      students_acc,
      students_notAcc,
      ticher: req.session.menejer,
      mutahasislar
    });
  } else {
    res.render("loginmenejer", {
      title: "login menejer",
      URL: process.env.URL,
      style: [{ href: "style/loginmenejer.css" }],
    });
  }
};

const menejerFilter = async (req, res) => {
  if (req.session.menejerLogged == true) {
    if (req.body.ticher == "all") {
      const StudentFilter = (await studentSchema.find().lean()).filter(student=>student.acceptance ==true)
      StudentFilter.forEach((student) => {
        const oylik = student.category.filter((c) => c.oylik == false);
        student.oylik = oylik.length == 0 ? true : false;
      });
      res.send({StudentFilter})
    
    }else{

      const ticher = await ticherShema.findOne({ name: req.body.ticher }).lean();
      const StudentFilter = (await studentSchema.find().lean()).filter(
        (Student) => {
          const category = Student.category.map((e) => e.name);
          const ticherSpes = ticher.specialty.map((e) => e.name);
          let indikator = false;
          if(Student.acceptance){
          for (let i = 0; i < category.length; i++) {
            for (let b = 0; b < ticherSpes.length; b++) {
              if (category[i] == ticherSpes[b]) {
                indikator = true;
              }
            }
          }
          }
          if (indikator) {
            return Student;
          }
        }
      );
      StudentFilter.forEach(student=>{
        const oylik = student.category.filter(c=>{
          const ticherSpes = ticher.specialty.map((e) => e.name);
          return ticherSpes.includes(c.name) && c.oylik == false
        })
        student.oylik = oylik.length ==0?true:false
      })
      res.send({StudentFilter , ticher});
    }
  }
}


const filterTolov =async (req, res)=>{
  if(req.session.menejerLogged == true){
    if(req.body.data !="all"){
      if(req.body.data == "false"){
        const students = (await studentSchema.find().lean()).filter(student=>{
          const tolov = student.category.map(s=>s.oylik)
          if(tolov.includes(false)) return student
        })
        res.send(students)
      }else{
        const students = (await studentSchema.find().lean()).filter(student=>{
          const tolov = student.category.map(s=>s.oylik)
          if(!tolov.includes(false)) return student
        })
        students.forEach(e=>{e.oylik = true})
        res.send(students)
      }
    }else{
      const students = await studentSchema.find().lean()
      res.send(students)
    }
  }
}

const sendMessageMenejer = async (req, res)=>{
  if(req.session.menejerLogged){
    const ID_S = req.body.targets
    if(ID_S.length > 0){
    ID_S.forEach(async id=>{
      const student = await studentSchema.findById(id).lean()
      student.messageByTeacher.push({
        messageText: req.body.message,
        status: "success",
        teacher: "menejer",
        statusMessage: "",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      });
  
      await studentSchema.findByIdAndUpdate(id, {
        messageByTeacher: student.messageByTeacher,
      })
    })
    res.send({message:"HABAR YUBORILDI"})
  }else{
    res.send({message:"oquvchilar yoq"})
  }

  }else{
    res.send({message:"menejer sifatida kirilmagan"})
  }
}
module.exports = {
  menejerPost,
  menejerGet,
  menejerFilter,
  filterTolov,
  sendMessageMenejer
};
