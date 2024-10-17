// Add event listeners when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Handle rating selection
    const ratingSelect = document.getElementById("rating");
    if (ratingSelect) {
        ratingSelect.addEventListener("change", function () {
            const rating = this.value;
            console.log(`Selected rating: ${rating}`);
        });
    }

    // Form validation
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
        form.addEventListener("submit", function (event) {
            const requiredFields = form.querySelectorAll("[required]");
            let isValid = true;

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add("error");
                } else {
                    field.classList.remove("error");
                }
            });

            if (!isValid) {
                event.preventDefault();
                alert("Please fill in all required fields.");
            }
        });
    });
});
