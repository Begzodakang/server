const oquchilar = document.querySelector(".royhatdanOtgan");
const btnLogout = document.querySelector(".account-button");
btnLogout.addEventListener("click", () => {
  fetch(window.location.href + "/logout", {
    method: "POST",
    body: JSON.stringify({ status: "logout" }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      if (res.message == "ok") location.reload();
    });
});
const sendMessage = (student) => {
  document.querySelector(".status-share").addEventListener("click", (e) => {
    const messageText = document.querySelector(".status-textarea").value;
    const status = document.querySelector("#status");

    if (messageText != "") {
      if (status.value != "") {
        fetch(location.origin+"/profile/tichers/sendmessage", {
          method: "POST",
          body: JSON.stringify({
            message: messageText,
            status: status.value,
            id: student._id,
            ticher:"menejer"
          }),
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((data) => data.json())
        .then((data) => {
          alert(data.message);
          document.querySelector(".status-textarea").value = "";
        });
      } else {
        alert("STATUS BO'SH");
      }
    } else {
      alert("habar biriktirilmagan");
    }
  });
};

const yonalish = document.querySelector("#yonalish");
yonalish.addEventListener("input", () => {
  fetch(location.href + "/filter/ticher", {
    method: "POST",
    body: JSON.stringify({ ticher: yonalish.value }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      let matn = "";
      res.StudentFilter.forEach((student) => {
        matn += `
            <div class="user" id="${student._id}">
                <img src="${student.avatar}" class="user-img">
                <div class="username">${student.name} ${student.fristName}
                    <div class="user-status ${
                      student.oylik ? "" : "idle"
                    }"></div>
                </div>
            </div>
        `;
      });
      oquvchilarG = res.StudentFilter;
      oquchilar.innerHTML = matn;
      studentData();
      let options = "<option value='all'>hammasi</option>";
      if (res.ticher) {
        res.ticher.specialty.forEach((s) => {
          options += `<option value="${s.name}">${s.name}</option>`;
        });
      }
      coursiBoyicha.innerHTML = options;
    });
});

let oquvchilarG;
const coursiBoyicha = document.querySelector("#coursiBoyicha");

coursiBoyicha.addEventListener("input", () => {
  let matn = "";
  if (oquvchilarG) {
    if (coursiBoyicha.value != "all") {
      const filterStudent = oquvchilarG.filter((student) => {
        const yonalish = student.category.map((e) => e.name);
        if (yonalish.includes(coursiBoyicha.value)) {
          return student;
        }
      });
      filterStudent.forEach((student) => {
        matn += `
            <div class="user" id="${student._id}">
                <img src="${student.avatar}" class="user-img">
                <div class="username">${student.name} ${student.fristName}
                    <div class="user-status ${
                      student.oylik ? "" : "idle"
                    }"></div>
                </div>
            </div>
        `;
      });
      oquchilar.innerHTML = matn;
      studentData();
    } else {
      oquvchilarG.forEach((student) => {
        matn += `
            <div class="user" id="${student._id}">
                <img src="${student.avatar}" class="user-img">
                <div class="username">${student.name} ${student.fristName}
                    <div class="user-status ${
                      student.oylik ? "" : "idle"
                    }"></div>
                </div>
            </div>
        `;
      });
      oquchilar.innerHTML = matn;
      studentData();
    }
  }
});

const tolovBoyicha = document.querySelector(".tolovBoyicha");

tolovBoyicha.addEventListener("input", () => {
  fetch(location.href + "/filter/tolov", {
    method: "POST",
    body: JSON.stringify({ data: tolovBoyicha.value }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      let matn = "";
      res.forEach((student) => {
        matn += `
          <div class="user" id="${student._id}">
              <img src="${student.avatar}" class="user-img">
              <div class="username">${student.name} ${student.fristName}
                  <div class="user-status ${student.oylik ? "" : "idle"}"></div>
              </div>
          </div>
      `;
      });
      oquchilar.innerHTML = matn;
      studentData();
    });
});

const studentData = () => {
  document.querySelectorAll(".user").forEach((student) => {
    student.addEventListener("click", () => {
      const student_id = student.id;
      console.log(student_id);
      fetch("profile/tichers/studentData/" + student_id)
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          const category = data.category
          let categoryW = ''
          let tolov = ''
          category.forEach(c=>{
            categoryW+= `
              <div class="info" style="margin-bottom:2px; border-bottom:1px solid cyan">${c.name} tolov ${c.oylik?"✔":"❌"} ${
                c.boshlanish.slice(0 , c.boshlanish.search("<"))
              } dan</div>
            `
              tolov += `
                <option value="${c.name}">${c.name}</option>
              `
          })
          let mavjudligi  =`
            <button class="qabul">qabul qilish</button>`
        
          
          

          console.log(categoryW);
          const WriteData = `
          <div class="main-container">
          <div class="profile">
            <div class="profile-avatar">
              <img src="${data.avatar}" alt=""
                class="profile-img">
              <div class="profile-name">${data.name} ${data.fristName} </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1508247967583-7d982ea01526?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
              alt="" class="profile-cover">
            <div class="profile-menu">
    
            </div>
          </div>
          <div class="timeline">
            <div class="timeline-left">
    
              <div class="intro box">
                <div class="intro-title">
                 o'quvchining kurslari
                </div>
                
               ${categoryW}
            
              </div>
    
            </div>

            <div class="timeline-right">
              <div class="status box">
                <div class="status-menu">
                  <span class="status-menu-item active" href="#">Status</span>
                  <select id="status">
                    <option value="">Status tanlang</option>
                    <option value="danger">qizil</option>
                    <option value="warning">sariq</option>
                    <option value="success">yashil</option>
                  </select>
                </div>
                <div class="status-main">
                  <img src="${data.avatar}" class="status-img">
                  <textarea class="status-textarea" placeholder="Write a message"></textarea>
                </div>
                <div class="status-actions">
    
                  <button class="status-share">Send</button>
                </div>
              </div>
    
            </div>
          </div>
    
          <div class="album box" style="display:flex ; ">
            <img src="${data.doc}" width="70%">
            <div style="width:30% ; height:100% ; display:flex; align-items:center; justify-content:center ; flex-direction:column">
              <h2>tolovni bazaga qoshish</h2>
              <select class="tolovSend">
              <option value="">kurslar</option>
                ${tolov}
              </select>
          <h4>tel => ${data.tel[0]}</h4>

              ${data.acceptance?"":mavjudligi}
              <button class="remove">o'chirish</button>
            </div>
          </div>
        </div>
          `;

          document.querySelector(".main").innerHTML = WriteData;
          sendMessage(data)
          const tolovSend = document.querySelector(".tolovSend")
          tolovSend.addEventListener("input" , (e)=>{
            tolovF(e, data._id)
          })
          if(document.querySelector(".qabul")){
            const qabulBtn = document.querySelector(".qabul")
            qabulBtn.addEventListener("click" , ()=>{qabulF(data)})
          }
          document.querySelector(".remove").addEventListener("click" , ()=>{
            const tasdiq = confirm("oquvchini ochirishga aminmisiz")
            if(tasdiq){
              fetch(window.location.href+"/remove" ,{
                method:"POST",
                body:JSON.stringify({id:data._id}),
                headers:{"Content-type":"application/json"}
              }).catch(err=>{
                alert(err.message)
              })
              .then(data=>data.json())
              .then(res=>{
                alert(res.message)
                location.reload()
              })
            }
          })
        });
    });
  });
};
studentData();

const sendMessageBtn = document.querySelector(".btnSendMessage");

fetch(location.href + "/filter/tolov", {
  method: "POST",
  body: JSON.stringify({ data: "all" }),
  headers: {
    "Content-type": "application/json",
  },
})
  .then((data) => data.json())
  .then((res) => {
    oquvchilarG = res;
  });

sendMessageBtn.addEventListener("click", () => {
  if (oquvchilarG) {
    const modal = document.createElement("main");
    modal.classList = "modal";

    let oquvchilarL = "";
    oquvchilarG.forEach((student) => {
      oquvchilarL += `
    <div class="user" id="${student._id}">
    <input type="checkbox" class="checkBox">
      <img src="${student.avatar}" class="user-img">
      <div class="username">${student.name} ${student.fristName}
      </div>
    </div>
    `;
    });
    const elements = `
    <div class="modalMessage">
      <header class='box'>
        <textarea id="Messagetext"></textarea>
        <button class='sendMessage'>Send</button>
      </header>
      <header class='box'>
      <div class='side-title'>
        <input type="checkbox" class="checkBoxAll">
        <span style="margin-left:10px">hammasini belgilash</span>
      </div>
      ${oquvchilarL}
      </header>
    </div>
  `;
    modal.innerHTML = elements;
    document.body.appendChild(modal);

    const users = document.querySelectorAll(".user");
    const cheskAll = document.querySelector(".checkBoxAll");
    users.forEach((u, i) => {
      u.addEventListener("click", (event) => {
        if (event.target.localName != "input") {
          u.children[0].checked = u.children[0].checked == true ? false : true;
        }
      });
    });

    cheskAll.addEventListener("click", () => {
      users.forEach((u) => {
        u.children[0].checked = cheskAll.checked == true ? true : false;
      });
    });
    modal.addEventListener("click" , (e)=>{
      if(e.target.classList == "modal"){
        modal.remove()
      }
    })
    document.querySelector(".sendMessage").addEventListener("click", () => {
      const ID_S = Array.from(users)
        .filter((user) => user.children[0].checked == true)
        .map((user) => user.id);
      if (ID_S.length > 0) {
        fetch(location.href + "/sendmessage", {
          method: "POST",
          body: JSON.stringify({
            message: document.querySelector("#Messagetext").value,
            targets: ID_S,
          }),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((data) => data.json())
          .then((res) => {
            alert(res.message);
            modal.remove()
          });
      } else {
        alert("oquvchi tanlanmagan");
        
      }
    });
  } else {
    alert("hali malumotlar yuklanmagan");
  }
});


const tolovF = (e , oquvchiID)=>{
  if(e.target.value !=""){
    const tasdiq = confirm("haqiqatdanham"+" " +e.target.value+"kursiga tolov bolganini tasdiqlang")
    if(tasdiq){
      fetch(location.href+"/tolov" , {
        method:"POST",
        body:JSON.stringify({cours:e.target.value , target:oquvchiID}),
        headers:{
          "Content-type":"application/json"
        }
      }).then(data=>data.json())
      .then(res=>{
        alert(res.message)
      })
    }
  }
}



const qabulF = (studnt)=>{
  fetch(location.href+"/tasdiq/student" , {
    method:"POST",
    body:JSON.stringify({
      student:studnt._id
    }),
    headers:{
      "Content-type":"application/json"
    }
  }).then(data=>data.json())
  .then(res=>{
    alert(res.message)
    location.reload()
  })
}

document.querySelector(".reset").addEventListener("click" , ()=>{
  const tasdiq = confirm("oquvchilarni tolov holatini boshlangich holatiga qautarishga aminmisiz")
  if(tasdiq){
    fetch(location.href+"/reset")
    .then(data=>data.json())
    .then(data=>{
      alert(data.message)
      location.reload()
    })
  }
})