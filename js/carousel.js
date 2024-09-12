// code to configure the carousel.
export default function todaysForecastCarousel() {
    let carouselTrack = document.querySelector(".carousel-track");
    let carouselSlide = document.querySelectorAll(".carousel-slide");


    let isDragging = false;
    let startX, scrollLeft;

    carouselTrack.addEventListener('mousedown', startDrag);
    carouselTrack.addEventListener('mousemove', handleDrag);
    carouselTrack.addEventListener('mouseup', endDrag);
    carouselTrack.addEventListener('mouseleave', endDrag);

    function startDrag(event) {
        isDragging = true;
        startX = event.pageX - carouselTrack.offsetLeft;
        scrollLeft = carouselTrack.scrollLeft;
        carouselSlide.forEach((slide) => {
            Array.from(slide.children).forEach((child) => {
                child.style.userSelect = "none";
            }); 
    
        });
    }

    function handleDrag(event) {
        if (!isDragging) return;
        event.preventDefault();
        const x = event.pageX - carouselTrack.offsetLeft;
        carouselTrack.scrollLeft = scrollLeft;
    }

    function endDrag() {
        isDragging = false;
        carouselSlide.forEach((slide) => {
            Array.from(slide.children).forEach((child) => {
                child.style.userSelect = "auto";
            }); 
    
        });
    }
}