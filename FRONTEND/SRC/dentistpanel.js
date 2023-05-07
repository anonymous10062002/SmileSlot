
let usernamehere = document.getElementById("usernamehere")
usernamehere.innerText = localStorage.getItem("dentalusername")

let cityinput = document.getElementById("cityinput")
let clinicinput = document.getElementById("clinicinput")
let cityinputreconfirm = document.getElementById("cityinputreconfirm")

let addclinic = document.getElementById("addclinic")
let token = localStorage.getItem("dentaltoken")
let userID = localStorage.getItem("dentaluserID")

addclinic.addEventListener("click", (e) => {
    console.log(token)
    e.preventDefault()

    if (cityinput.value !== cityinputreconfirm.value) {
        const module = document.getElementById('cart-module');
        module.innerText = "Check the city again !!"
        module.style.display = 'block';
        module.style.borderRadius = '20px';
        module.style.backgroundColor = "red";
        module.style.textAlign = "center"
        module.style.padding = "30px"
        module.style.fontSize = "20px"
        module.style.fontWeight = "900"

        setTimeout(() => {
            module.style.display = 'none';
        }, 3000);

        return
    }

    let payload = {
        city: cityinput.value,
        clinic: clinicinput.value,
    }

    console.log

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
        console.log(data)

        if (data.msg = "clinic added successfully") {
            const module = document.getElementById('cart-module');
            module.innerText = "Clinic Added Successfully !!"
            module.style.display = 'block';
            module.style.borderRadius = '20px';
            module.style.backgroundColor = "red";
            module.style.textAlign = "center"
            module.style.padding = "30px"
            module.style.fontSize = "20px"
            module.style.fontWeight = "900"
        }

        setTimeout(() => {
            const module = document.getElementById('cart-module');
            module.style.display = 'none';
        }, 3000);


    }).catch((err) => {
        console.log(err)
    })

})