const canvasWrite = (data) => {
  var chart = document.getElementById("myChart").getContext("2d"),
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
      labels: ["", "", "", "", "", "", "", "", "", "", "", "","","","",""],
      datasets: [{
          label: "oquvchining bahosi",
          backgroundColor: 'rgba(255, 70, 130, 0.5)',
          borderColor: 'rgba(255, 50, 132, 1)',
          data: data.length>16?data.slice(data.length-16 , data.length):data
      }]
  },
    options: options,
  });
};

const getBaho = (course)=>{
  fetch(window.location.href+"/baho/"+course)
  .then(data=>data.json())
  .then(res=>{
    console.log(res);
    if(!res.message) canvasWrite(res[0].baho)
    else alert(res.message)
  })
}
const categoryCouse = document.querySelector(".categoryCouse").children[0].innerHTML
getBaho(categoryCouse)
const avatarFile = document.querySelector("#avatar");

document
  .querySelector(".btn.btn-primary.btn-sm.mt-3")
  .addEventListener("click", () => {
    avatarFile.click();
  });

avatarFile.addEventListener("input", () => {
  const form = document.createElement("form");
  form.enctype = "multipart/form-data";
  const formData = new FormData(form);
  formData.append("avatarStudent", avatarFile.files[0]);
  fetch(window.location.href + "/avatarStudent", {
    method: "POST",
    body: formData,
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data.avatar);
      document.querySelector("#g-profile-img").src = data.avatar;
    });
});

document.querySelector("#logOut").addEventListener("click", () => {
  const tasdiqlash = confirm("haqiqtdanham profildan chiqishni hohlaysizmi");
  if (tasdiqlash) {
    fetch(window.location.href + "/logout");
    window.location.href = window.location.origin;
  }
});

const selectNewCourse = document.querySelector("#newCourse");
selectNewCourse.addEventListener("input", () => {
  if (selectNewCourse.value != "") {
    const tasdiq = confirm(
      selectNewCourse.value + " kursiga yozilishni hohlaysizmi"
    );
    if (tasdiq) {
      fetch(window.location.href + "/newcourse", {
        method: "POST",
        body: JSON.stringify({
          course: selectNewCourse.value,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          if (data.course != undefined) {
            const options = document.createElement("option");
            options.value = data.course;
            options.innerHTML = data.course;
            document.querySelector(".categoryCouse").appendChild(options);
            // the end create options
          }
          const tr = document.createElement("tr");
          const newMessage = `                                                       
                    <td>${data.message.messageText}</td>
                    <td>
                        <span class="badge badge-pill badge-${data.message.status}">${data.message.statusMessage}</span>
                    </td>
                    <td>
                        <span class="g-auteur" style="color: greenyellow;">${data.message.teacher}</span>
                        <br />
                    </td>
                    <td>${data.message.vaqt}</td>
                    <td>
                    </td>
                    `;
          tr.innerHTML = newMessage;
          console.log(data.message.vaqt);

          document.querySelector(".tbody").prepend(tr);
        });
    }
  }
});


const course = document.querySelector(".categoryCouse")
course.addEventListener("input" ,()=>{
  getBaho(course.value)
})