// JavaScript for theme toggling and form handling

// Theme toggle between light and dark mode
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
});

// Form Validation
const form = document.getElementById('contactForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from submitting normally

    // Gather form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simple form validation
    if (name === '' || email === '' || message === '') {
        alert('Please fill out all fields.');
    } else {
        alert('Message sent successfully!');
    }
});

// Save user's dark mode preference using localStorage
window.onload = () => {
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = 'Light Mode';
    }
};

themeToggle.addEventListener('click', () => {
    let darkMode = localStorage.getItem('dark-mode');
    if (darkMode !== 'enabled') {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});
