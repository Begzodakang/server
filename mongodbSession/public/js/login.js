const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const ustoz = document.getElementById("form1");
const oquvchi = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

ustoz.addEventListener("submit", function(e){
	e.preventDefault()
	fetch(window.location.origin+"/login/tichers" ,{
		method:"POST",
		body:JSON.stringify({
			name:this.children[1].value,
			fname:this.children[2].value,
			password:this.children[3].value
		}),
		headers:{
			"Content-type":"application/json"
		}
	}).then(data=>data.json())
	.then(data=>{
		console.log(data)
		if(data.status){
			window.location.href = window.location.origin+"/profile/tichers"
		}
	})

});
oquvchi.addEventListener("submit", function(e){
	e.preventDefault()
	fetch(window.location.origin+"/login/student",{
		method:"POST",
		body:JSON.stringify({
			name:this.children[1].value,
			fname:this.children[2].value,
			password:this.children[3].value
		})
		,headers:{
			"Content-type":"application/json"
		}
	}).then(data=>data.json())
	.then(data=>{
		console.log(data);
		if(data.status){
			window.location.href = "/profile/student"
		}
	})
});
