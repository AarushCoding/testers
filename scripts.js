const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const billingToggle = document.getElementById("billingToggle");

hamburger.addEventListener("click", () => {
    // Toggle the "active" class to open/close the menu
    hamburger.classList.toggle("active");
    navMenu.classList.togg.le("active");
});

// Close the menu when a link is clicked (useful for one-page sites)
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));




billingToggle.addEventListener("change", function() {
    const yearly = this.checked;

    const plusPrice = document.querySelector(".price-plus");
    const proPrice = document.querySelector(".price-pro");

    const plusDiscount = document.querySelector(".plus-discount");
    const proDiscount = document.querySelector(".pro-discount");

    if (yearly) {
        plusPrice.textContent = "£114.99/yr";
        proPrice.textContent = "£224.99/yr";

        plusDiscount.textContent = "Save 4%";
        proDiscount.textContent = "Save 6%";
    } else {
        plusPrice.textContent = "£9.99/mo";
        proPrice.textContent = "£19.99/mo";

        plusDiscount.textContent = "";
        proDiscount.textContent = "";
    }
});


