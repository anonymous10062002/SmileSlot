
let usernamehere = document.getElementById("usernamehere")
usernamehere.innerText = localStorage.getItem("dentalusername")

let cityinput = document.getElementById("cityinput")
let clinicinput = document.getElementById("clinicinput")
let cityinputreconfirm = document.getElementById("cityinputreconfirm")

let addclinic = document.getElementById("addclinic")
let token = localStorage.getItem("dentaltoken")
let userID = localStorage.getItem("dentaluserID")

addclinic.addEventListener("click", (e) => {
    e.preventDefault()
    if (cityinput.value !== cityinputreconfirm.value) {

        swal(``, "Check the city again !!", "error");

        setTimeout(() => {
            module.style.display = 'none';
        }, 3000);

        return
    }

    let payload = {
        city: cityinput.value,
        clinic: clinicinput.value,
    }
    fetch("http://localhost:4000/users/addclinic", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if(data.msg){
            swal(``, data.msg, "success");
            cityinput.value=null;
            clinicinput.value=null;
            cityinputreconfirm.value=null;
        }
        else{
            swal(``, data.err, "error");
        }

    }).catch((err) => {
        swal(``, err, "error");
    })

})

let herebook = document.getElementById("herebook")

window.addEventListener("load", () => {
    fetch("http://localhost:4000/users/dentist/appointments", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {

        console.log(data)

        data.bookedslots.forEach(obj => {
            const timestamp = obj.time;
            const date = new Date(timestamp);
            const dateString = date.toDateString();
            const timeString = date.toLocaleTimeString();
            const userID = obj.userID;

            herebook.innerHTML += `<div class="vpdentist">Time: ${dateString} ${timeString}, Token No : ${userID} 
                <button class="canceldent">Cancel</button>
            </div>`;
        });

    }).catch((err) => {
        console.log(err);
    })

})



let btnlogin = document.getElementById("btnlogin")

window.addEventListener("load",()=>{
    if(token == undefined){
      window.location.href = "../Public/index.html"
    }
})



btnlogin.addEventListener("click", () => {
  fetch(`http://localhost:4000/users/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  }).then((res) => res.json())
    .then((res) => {
      swal(``, res.msg, "success");
      setTimeout(() => {
        localStorage.removeItem("dentaltoken");
        token = null;
        window.location.href = "../Public/index.html";
      }, 3000)
    }).catch((error) => {
      swal(``, error.message, "error")
    })
})

