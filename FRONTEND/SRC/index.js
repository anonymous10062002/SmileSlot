const leftScroll = document.querySelector('.left-scroll');
const rightScroll = document.querySelector('.right-scroll');
const scrollContainer = document.querySelector('.scroll-container');

let currentIndex = 0;
const scrollAmount = 1;
const images = scrollContainer.querySelectorAll('img');
const maxIndex = images.length - 1;

leftScroll.addEventListener('click', () => {
  currentIndex = (currentIndex - scrollAmount < 0) ? maxIndex : currentIndex - scrollAmount;
  const scrollPosition = images[currentIndex].offsetLeft;
  scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
});

rightScroll.addEventListener('click', () => {
  currentIndex = (currentIndex + scrollAmount > maxIndex) ? 0 : currentIndex + scrollAmount;
  const scrollPosition = images[currentIndex].offsetLeft;
  scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
});



let usernamehere = document.getElementById("usernamehere")

usernamehere.innerText = localStorage.getItem("dentalusername")

let btnlogin = document.getElementById("btnlogin")
let token = localStorage.getItem("dentaltoken")

window.addEventListener("load",()=>{
    if(token == undefined){
      window.location.href = "../index.html"
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
        window.location.href = "../index.html";
      }, 3000)
    }).catch((error) => {
      swal(``, error.message, "error")
    })
})



