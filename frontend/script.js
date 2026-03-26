// Smooth scrolling for navbar links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Form submission → send data to Node.js backend
const form = document.getElementById("contactForm");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const message = document.querySelector('textarea[name="message"]').value.trim();

    // Validation
    if (name === "" || email === "" || message === "") {
        alert("All fields are required!");
        return;
    }

    if (!email.includes("@")) {
        alert("Enter a valid email!");
        return;
    }

    try {
        // ✅ Send data to backend
        const response = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        alert(data.message); // "Form submitted successfully!"

        form.reset();

    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to server!");
    }
});