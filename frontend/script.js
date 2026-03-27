// 1. Smooth scrolling for navbar links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Only trigger for internal anchor links (starting with #)
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// 2. ✅ Configuration: Backend URL Logic
// This automatically switches between your local machine and your Render server.
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000" 
    : "https://your-backend-service-name.onrender.com"; // <-- REPLACE with your actual Render URL later

// 3. Form Submission Handling
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Extract values from the form
        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        // Client-side Validation
        if (!name || !email || !message) {
            alert("Please fill in all fields before sending.");
            return;
        }

        // Visual Feedback: Disable button and change text while "Loading"
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        try {
            // ✅ Send data to Node.js backend
            const response = await fetch(`${BASE_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Success! Your message has been sent. ✅");
                contactForm.reset(); // Clear form fields
            } else {
                // Handle server-side errors (e.g., Database connection failed)
                throw new Error(data.error || "Server rejected the request.");
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            alert("❌ Connection Error: Unable to reach the server. Make sure your Render backend is 'Active'.");
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
}