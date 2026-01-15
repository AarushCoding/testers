const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    // Toggle the "active" class to open/close the menu
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close the menu when a link is clicked (useful for one-page sites)
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));
