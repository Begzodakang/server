const canvasWrite = (data) => {
  var chart = document.getElementById("chart").getContext("2d"),
    gradient = chart.createLinearGradient(0, 0, 0, 450);

  gradient.addColorStop(0, "rgba(0, 199, 214, 0.32)");
  gradient.addColorStop(0.3, "rgba(0, 199, 214, 0.1)");
  gradient.addColorStop(1, "rgba(0, 199, 214, 0)");

  var options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      easing: "easeInOutQuad",
      duration: 520,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#5e6a81",
            max: 10,
          },
          gridLines: {
            color: "rgba(200, 200, 200, 0.08)",
            lineWidth: 1,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "#5e6a81",
          },
        },
      ],
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    legend: {
      display: false,
    },
    point: {
      backgroundColor: "#00c7d6",
    },
    tooltips: {
      titleFontFamily: "Poppins",
      backgroundColor: "rgba(0,0,0,0.4)",
      titleFontColor: "white",
      caretSize: 5,
      cornerRadius: 2,
      xPadding: 10,
      yPadding: 10,
    },
  };

  var chartInstance = new Chart(chart, {
    type: "line",
    data: {
      labels: ["", "", "", "", "", "", "", "", "", "", "", ""],
      datasets: [
        {
          label: "Applications",
          backgroundColor: gradient,
          pointBackgroundColor: "#00c7d6",
          borderWidth: 1,
          borderColor: "#0e1a2f",
          data:data.length>12?data.slice(data.length-12 , data.length):data,
        },
      ],
    },
    options: options,
  });
};

document.querySelector("#avatar").addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  fileInput.click();
  fileInput.addEventListener("input", uploadAvatar);
});

const uploadAvatar = (event) => {
  const file = event.target.files[0];
  const form = document.createElement("form");
  form.enctype = "multipart/form-data";
  const formData = new FormData(form);
  formData.append("tichers", file);
  fetch(window.location.href + "/avatar", {
    method: "post",
    body: formData,
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      document.querySelector("#avatar").src = data.avatar;
    });
};

const studentData = () => {
  document.querySelectorAll(".user").forEach((student) => {
    student.addEventListener("click", () => {
      const student_id = student.id;
      console.log(student_id);
      fetch(location.href + "/studentData/" + student_id)
        .then((data) => data.json())
        .then((data) => {
          const WriteData = `
        <div class="main-container">
        <div class="profile">
          <div class="profile-avatar">
            <img src="${data.avatar}" alt=""
              class="profile-img">
            <div class="profile-name">${data.name} ${data.fristName}</div>
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
                Introduction
              </div>
              <div class="info">
                <select id="yoqlama" >
                  <option value="">Yoqlama</option>
                  <option value="true">Keldi</option>
                  <option value="false">Kelmadi</option>
                </select>
              </div>
              <div class="info">
                Baho qoyish
              </div>
              <div class="info">
                <select id="baho">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
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
  
        <div class="album box">
          <canvas id="chart" width="785" height="392" style="display: block; width: 785px; height: 392px;"
            class="chartjs-render-monitor"></canvas>
        </div>
      </div>
        `;
          console.log(data.category.filter(e=>e.name == yonalish.value)[0].baho);
          document.querySelector(".main").innerHTML = WriteData;
          canvasWrite(data.category.filter(e=>e.name == yonalish.value)[0].baho);
          Yoqlama(data);
          sendMessage(data);
          baho(data)
          dataGlobal = data
        });
      });
  });
};
let dataGlobal;
studentData();

const Yoqlama = (student) => {
  document.querySelector("#yoqlama").addEventListener("input", () => {
    if (document.querySelector("#yoqlama").value != "") {
      const sorov = confirm(
        "tasdiqlang " +
        (document.querySelector("#yoqlama").value == "true"
        ? "kelgan"
        : "darsda yoq") +
          " togrimi?"
      );
      if (sorov) {
        fetch(window.location.href + "/yoqlama", {
          method: "POST",
          body: JSON.stringify({
            id: student._id,
            data: document.querySelector("#yoqlama").value,
          }),
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((data) => data.json())
        .then((data) => {
          alert(data.message);
        });
      }
    }
  });
};

const sendMessage = (student) => {
  document.querySelector(".status-share").addEventListener("click", (e) => {
    const messageText = document.querySelector(".status-textarea").value;
    const status = document.querySelector("#status");

    if (messageText != "") {
      if (status.value != "") {
        fetch(window.location.href + "/sendmessage", {
          method: "POST",
          body: JSON.stringify({
            message: messageText,
            status: status.value,
            id: student._id,
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

document.querySelector(".account-button").addEventListener("click", () => {
  const tasdiq = confirm("Acountdan chiqishni istaysizmi");
  if (tasdiq) {
    fetch(window.location.href + "/logout", {
      method: "POST",
      body: JSON.stringify({
        status: false,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((data) => data.json())
    .then((data) => {
      if (data.status) {
          window.location.href = window.location.origin;
        }
      });
  }
});

const baho = (student) => {
  const sentBaho = document.querySelector("#baho");
  sentBaho.addEventListener("input", () => {
    const tasdiq = confirm(
      student.name + "ga " + sentBaho.value + " qoymoqchimisiz"
      );
      
      if (tasdiq) {
        fetch(window.location.href + "/baho", {
          method: "POST",
          body: JSON.stringify({
            baho: sentBaho.value,
            id: student._id,
            course:document.querySelector("#yonalish").value
          }),
          headers: {
            "COntent-type": "application/json",
          },
        })
        .then((data) => data.json())
        .then((data) => {
          alert(data.message);
          canvasWrite(data.category.filter(e=>e.name == yonalish.value)[0].baho);

        });
    }
  });
};

const yonalish = document.querySelector("#yonalish")
yonalish.addEventListener("input" , ()=>{
  if(dataGlobal){
    const baho = dataGlobal.category.filter(e=>e.name == yonalish.value)
    if(baho.length >0){
      canvasWrite(dataGlobal.category.filter(e=>e.name == yonalish.value)[0].baho);
    }else{
      document.querySelector(".main").innerHTML = ''
      dataGlobal = null
    }
  }

  fetch(location.href+"/filter/yonalish" , {
    method:"POST",
    body:JSON.stringify({course:yonalish.value}),
    headers:{
      "Content-type":"application/json"
    }
  }).then(data=>data.json())
  .then(res=>{
    console.log(res);
    const oquchilar = document.querySelector("#oquvchilar")
    let matn = ''
    res.forEach(student=>{
      const oylik = student.category.filter(e=>e.name == yonalish.value).map(e=>e.oylik)[0]
       matn += `
          <div class="user" id="${student._id}">
            <img src="${student.avatar}" class="user-img">
            <div class="username">${student.name} ${student.fristName}
                <div class="user-status ${oylik?"":"idle"}"></div>
            </div>
          </div>
      `
    })
    oquchilar.innerHTML = matn
    console.log(matn);
    studentData()
  })
})