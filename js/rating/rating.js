const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");

stars.forEach((star) => {
    star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        rating.innerText = value;

        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five"));
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add(getStarColorClass(value));
            }
        });

        stars.forEach((s) => s.classList.remove("selected"));
        star.classList.add("selected");
    });
});

function getStarColorClass(value) {
    switch (value) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        default:
            return "";
    }
}
