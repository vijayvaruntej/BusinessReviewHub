
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
    apiKey: "AIzaSyAqZPCMb_OwsY0CbbDBCAtDQxCgkYBbSoI",
    authDomain: "bisunessreviewhub.firebaseapp.com",
    databaseURL: "https://bisunessreviewhub-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bisunessreviewhub",
    storageBucket: "bisunessreviewhub.firebasestorage.app",
    messagingSenderId: "561888303458",
    appId: "1:561888303458:web:42206440df74629789f43b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const testimonialsRef = ref(db, "testimonials");

const reviewForm = document.getElementById("reviewForm");
const testimonialsContainer = document.getElementById("testimonial-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
let testimonials = []; // Store testimonials data
let currentIndex = 0;

// Load testimonials from Firebase
async function loadTestimonials() {
    try {
        const snapshot = await get(testimonialsRef);
        if (snapshot.exists()) {
            testimonials = Object.values(snapshot.val()); // Convert object to array
        } else {
            testimonials = []; // Initialize as empty array if no data
        }
        renderTestimonials();
    } catch (error) {
        console.error("Error loading testimonials:", error);
    }
}


function renderTestimonials() {
    testimonialsContainer.innerHTML = ""; // Clear existing testimonials
    if (testimonials.length === 0) {
        testimonialsContainer.innerHTML = "<p>No reviews yet.</p>";
        return;
    }
    const testimonial = testimonials[currentIndex];
    const div = document.createElement("div");
    div.classList.add("testimonial", "active"); // Always show one active testimonial at a time
    div.innerHTML = `
        <p class="review">"${testimonial.review}"</p>
        <h4 class="user">- ${testimonial.name}, ${testimonial.business}</h4>
    `;
    testimonialsContainer.appendChild(div);

}


// Handle form submission
reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const business = document.getElementById("business").value;
    const review = document.getElementById("review").value;

    if (!name || !business || !review) return;

    try {
        await push(testimonialsRef, { name, business, review });
        reviewForm.reset();
        loadTestimonials(); // Reload testimonials after adding
    } catch (error) {
        console.error("Error saving review:", error);
    }
});

// Handle Next/Prev buttons
nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonials();
});

prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonials();
});

function autoSlideTestimonials() {
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        renderTestimonials();
    }, 5000); // 5 seconds interval
}


// Initial Load
loadTestimonials();

// Start Auto-Slideshow
autoSlideTestimonials();