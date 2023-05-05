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


// ON load window make that video in header start again and get the video by video tag

window.onload = function () {
  
}


