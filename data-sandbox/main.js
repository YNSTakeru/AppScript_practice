const websiteSelect = document.getElementById("website-select");
const genderSelect = document.getElementById("gender-select");

const ul = document.querySelectorAll("ul");

websiteSelect.addEventListener("change", (e) => {
    for (element of ul) {
        if (
            (element.dataset.website === websiteSelect.value ||
                websiteSelect.value === "all") &&
            (element.dataset.gender === genderSelect.value ||
                genderSelect.value === "all")
        ) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
});

genderSelect.addEventListener("change", (e) => {
    for (element of ul) {
        if (
            (element.dataset.website === websiteSelect.value ||
                websiteSelect.value === "all") &&
            (element.dataset.gender === genderSelect.value ||
                genderSelect.value === "all")
        ) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
});
