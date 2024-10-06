// app.js

// Dummy user database using localStorage for demonstration
const users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = localStorage.getItem('loggedInUser');

// Load posts from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    if (loggedInUser) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('post-section').style.display = 'block';
        document.getElementById('feed-section').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'block';
        loadPosts();
    }
});

// Handle Registration
document.getElementById('register-btn').addEventListener('click', function() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const errorElem = document.getElementById('auth-error');

    if (users.some(user => user.username === username)) {
        errorElem.textContent = 'Username already taken!';
    } else {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        errorElem.textContent = 'Registered successfully! You can now log in.';
    }
});

// Handle Login
document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorElem = document.getElementById('auth-error');

    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        loggedInUser = username;
        localStorage.setItem('loggedInUser', loggedInUser);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('post-section').style.display = 'block';
        document.getElementById('feed-section').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'block';
        errorElem.textContent = '';
    } else {
        errorElem.textContent = 'Invalid login credentials!';
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    location.reload();  // Refresh to return to login page
});

// Handle Posting
document.getElementById('post-btn').addEventListener('click', function() {
    const content = document.getElementById('post-content').value.trim();
    const file = document.getElementById('post-image').files[0];
    const fileErrorElem = document.getElementById('file-error');

    if (content || file) {
        const post = {
            content,
            fileURL: file ? URL.createObjectURL(file) : '',
            timestamp: new Date().toLocaleString()
        };

        savePostToLocalStorage(post);
        displayPost(post);
        document.getElementById('post-content').value = '';  // Clear input
        fileErrorElem.textContent = '';
    } else {
        fileErrorElem.textContent = 'Please write something or upload an image before posting!';
    }
});

// Save post to localStorage
function savePostToLocalStorage(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Display post
function displayPost(post) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postContent = document.createElement('p');
    postContent.textContent = post.content;

    const postImage = document.createElement('img');
    if (post.fileURL) {
        postImage.src = post.fileURL;
        postImage.style.maxWidth = '100%';
        postImage.style.borderRadius = '8px';
        postDiv.appendChild(postImage);
    }

    const postTimestamp = document.createElement('small');
    postTimestamp.textContent = post.timestamp;

    postDiv.appendChild(postContent);
    postDiv.appendChild(postTimestamp);
    document.getElementById('feed').prepend(postDiv);
}

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => displayPost(post));
}
