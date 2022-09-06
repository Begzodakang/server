const StudentSChema = require("../module/Registerschema");
const course =
  /front-end|back-end|cyber-havfsizlik|kompyuter-savodxonlik|ingliz-tili|rus-tili|grafik-dizayn/;
const teacherObj = {
  "rus-tili": "Alsu",
  "grafik-dizayn": "Asadbek",
  "front-end": "Begzod",
  "back-end": "Begzod",
  "cyber-havfsizlik": "Begzod",
  "kompyuter-savodxonlik": "Shaxzod",
  "ingliz-tili": "Sarvinoz",
};
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
// oquvchiniga royhatga olish sahifasini berish
// kurs boyicha
// method        get
// router        student/reg/:category
const registerStudent = (req, res) => {
  const confirmCours = course.test(req.params.category);
  if (confirmCours) {
    res.render("Studentregister", {
      title: "royhatga yozilish",
      style: [{ href: "style/StudentRegister.css" }],
      category: req.params.category,
      URL: process.env.URL,
    });
  } else {
    res.redirect("/404");
  }
};

// oquvchini royhatga olish
// kurs boyicha
// method        post
// router        /course/:category/add/
// redirect       /profile/student

const sentStudentDataToDB = async (req, res) => {
  const confirmCours = course.test(req.params.category);
  const studentOne = await StudentSChema.findOne({
    name: req.body.fname,
    fristName: req.body.lname,
  });
  let categoryAll;
  if (studentOne) categoryAll = studentOne.category.map((c) => c.name);

  if (confirmCours) {
    if (!studentOne) {
      const newStudent = req.body;
      newStudent.category = req.params.category;
      newStudent.doc = process.env.URL + "uploads/images/" + req.file.filename;
      const vaqt = `${new Date().getDate()} ${
        oy[new Date().getMonth() - 1]
      }<br> ${new Date().getHours()}:${
        new Date().getMinutes() > 9
          ? new Date().getMinutes()
          : "0" + new Date().getMinutes()
      }`;
      const data = {
        name: newStudent.fname,
        fristName: newStudent.lname,
        password: newStudent.pass,
        category: [
          {
            name: newStudent.category,
            baho: [0],
            oylik: false,
            boshlanish: vaqt,
          },
        ],
        doc: newStudent.doc,
        tel: [newStudent.tel],
      };
      const student = await StudentSChema.create(data);
      student.messageByTeacher[0].vaqt = vaqt;
      await StudentSChema.findByIdAndUpdate(student._id, {
        messageByTeacher: student.messageByTeacher,
      });
      req.session.student = student;
      req.session.islogged = true;
      req.session.save((err) => {
        if (err) throw err;
      });
      res.redirect("/profile/student");
    } else if (!categoryAll.includes(req.params.category)) {
      studentOne.category.push({ name: req.params.category });
      studentOne.tel.push(req.body.tel);
      await StudentSChema.findByIdAndUpdate(studentOne._id, {
        category: studentOne.category,
        tel: studentOne.tel,
      });
      const student = await StudentSChema.findById(studentOne._id);
      req.session.student = student;
      req.session.islogged = true;
      req.session.save((err) => {
        if (err) throw err;
      });
      res.redirect("/profile/student");
    } else {
      res.send(
        JSON.stringify({
          staus: "bunday oquvchi mavjud",
        })
      );
    }
  } else {
    res.redirect("/404");
  }
};

/*
    oquvchiga profilini berish
    method  ==>  get
    router  ==>  /profile/student
 
 */
const profileStudent = async (req, res) => {
  if (req.session.islogged) {
    const student = await StudentSChema.findById(
      req.session.student._id
    ).lean();
    if (student) {
      res.render("studentprofile", {
        title: req.session.student.name,
        student: student,
        messageByTeacher: student.messageByTeacher.reverse(),
        style: [{ href: "style/studentprofile.css" }],
        styles: `
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <!-- Bibliothèque d'icones-->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
            <!-- Material Design Bootstrap -->
            <link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.7.4/css/mdb.min.css" rel="stylesheet">
            `,
        URL: process.env.URL,
      });
    } else {
      req.session.islogged = false;
      req.session.save((e) => {
        if (e) throw e;
      });
      res.send("malomotlar ochirilgan sahifani qayta yuklang");
    }
  } else {
    res.redirect("/");
  }
};

const newCourseByFrontEnd = async (req, res) => {
  if (req.session.islogged) {
    const studentByDb = await StudentSChema.findById(req.session.student._id);
    const allCourse = studentByDb.category.map((course) => course.name);
    const tasdiq = allCourse.includes(req.body.course);
    console.log(tasdiq);
    if (!tasdiq) {
      const newMessage = {
        messageText:
          req.body.course +
          " kursiga muvofaqiyatli royhatdan o'tdingiz tez orada javobni kuting",
        status: "success",
        teacher: teacherObj[req.body.course],
        statusMessage: "new",
        urlMessage: process.env.URL + "urlmessage/default",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      };

      studentByDb.messageByTeacher.push(newMessage);
      studentByDb.category.push({
        name: req.body.course,
        baho: [0],
        oylik: false,
        boshlanish: newMessage.vaqt,
      });

      await StudentSChema.findByIdAndUpdate(studentByDb._id, {
        messageByTeacher: studentByDb.messageByTeacher,
        category: studentByDb.category,
      });

      res.send({
        message: newMessage,
        course: req.body.course,
      });
    } else {
      const newMessage = {
        messageText: req.body.course + " kursida oldindan royhatda mavjudsiz",
        status: "danger",
        teacher: teacherObj[req.body.course],
        statusMessage: "err",
        urlMessage: process.env.URL + "urlmessage/err",
        vaqt: `${new Date().getDate()} ${
          oy[new Date().getMonth() - 1]
        }<br> ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }`,
      };
      res.send({ message: newMessage });
      console.log(newMessage);
    }
  }else{
    res.send({message:"bu logindan chiqilgan"})
  }
};

module.exports = {
  registerStudent,
  sentStudentDataToDB,
  profileStudent,
  newCourseByFrontEnd,
};
