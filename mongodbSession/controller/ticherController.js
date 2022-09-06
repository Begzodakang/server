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

const ticherProfile = async (req, res) => {
  if (req.session.isloggedTicher == true) {
    const ticher = await ticherShema
      .findOne({
        name: req.session.ticher.name,
      })
      .lean();
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
    res.render("ticher", {
      title: "hello ticher",
      URL: process.env.URL,
      style: [{ href: "style/style.scss" }, { href: "style/tichers.css" }],
      ticher,
      student: StudentFilter,
    });
  } else {
    res.redirect("/404");
  }
};

const TicherYoqlama = async (req, res) => {
  if (req.session.isloggedTicher) {
    const student = await studentSchema.findById(req.body.id);
    if (req.body.data == "false") {
      student.messageByTeacher.push({
        messageText: student.name + " bugun darsga kelmadi",
        status: "warning",
        teacher: req.session.ticher.name,
        statusMessage: "yoqlama",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      });

      await studentSchema.findByIdAndUpdate(req.body.id, {
        messageByTeacher: student.messageByTeacher,
      });
      res.send({ message: "habar yuborildi" });
    } else if (req.body.data == "true") {
      student.messageByTeacher.push({
        messageText: student.name + " bugun darsga keldi",
        status: "success",
        teacher: req.session.ticher.name,
        statusMessage: "yoqlama",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      });
      await studentSchema.findByIdAndUpdate(req.body.id, {
        messageByTeacher: student.messageByTeacher,
      });
      res.send({ message: "habar yuborildi" });
    } else {
      res.send({ message: "habar yuborilmadi" });
    }
  }
};

const TichersendMessage = async (req, res) => {
  console.log(req.body);
  if (req.session.isloggedTicher || req.session.menejerLogged) {
    if (req.body.message != "" && req.body.status != "") {
      const student = await studentSchema.findById(req.body.id);
      student.messageByTeacher.push({
        messageText: req.body.message,
        status: req.body.status,
        teacher: req.body.ticher?req.body.ticher:req.session.ticher.name,
        statusMessage: "message",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      });
      await studentSchema.findByIdAndUpdate(req.body.id, {
        messageByTeacher: student.messageByTeacher,
      });
      res.send({
        message: "habar yuborildi",
      });
    } else {
      res.send({
        message: "nimadir hato yoki bekorchi urunish tutib qolindi",
      });
    }
  } else {
    res.send({
      message: "tizimdan oqituvchi sifatida royhatdan otilmagan",
    });
  }
};

const TicherBaho = async (req, res) => {
  if (req.session.isloggedTicher) {
    const student = await studentSchema.findById(req.body.id);
    const indikator = student.category.map((e) => e.name);
    if (indikator.includes(req.body.course)) {
      console.log(student);
      student.category.forEach((e) => {
        if (e.name == req.body.course) {
          e.baho.push(parseInt(req.body.baho));
        }
      });
      await studentSchema.findByIdAndUpdate(student._id, {
        category: student.category,
      });
      res.send({
        message: "baho qoyildi",
        category: student.category,
      });
    } else {
      res.send({
        message: "o'quvchi bu yonalishda oqimaydi",
      });
    }
  } else {
    res.send({
      message: "nimadir hato",
    });
  }
};

module.exports = {
  ticherProfile,
  TicherYoqlama,
  TichersendMessage,
  TicherBaho
};
