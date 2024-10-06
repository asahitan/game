// User Authentication
let currentUser = null;

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (!username || !password) {
        displayError("Please fill in both fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        displayError("Username already exists.");
        return;
    }

    users[username] = { password: password };
    localStorage.setItem("users", JSON.stringify(users));
    displayError("User registered! Please log in.");
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[username] || users[username].password !== password) {
        displayError("Invalid username or password.");
        return;
    }

    currentUser = username;
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("post-section").classList.remove("hidden");
    document.getElementById("posts-section").classList.remove("hidden");

    loadPosts();
}

function logout() {
    currentUser = null;
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("post-section").classList.add("hidden");
    document.getElementById("posts-section").classList.add("hidden");
}

function displayError(message) {
    document.getElementById("auth-error").textContent = message;
}

// Post Submission
function submitPost() {
    const postInput = document.getElementById("post-input").value;
    const imageInput = document.getElementById("image-upload").files[0];

    if (!postInput.trim() && !imageInput) {
        alert("Please write something or upload an image.");
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let imageBase64 = "";
    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function () {
            imageBase64 = reader.result;
            savePost(postInput, imageBase64);
        };
        reader.readAsDataURL(imageInput);
    } else {
        savePost(postInput, imageBase64);
    }
}

function savePost(content, image) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
        user: currentUser,
        content: content,
        image: image,
        timestamp: new Date().toLocaleString(),
    });
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("post-input").value = "";
    document.getElementById("image-upload").value = "";

    loadPosts();
}

// Load Posts
function loadPosts() {
    const postsSection = document.getElementById("posts-section");
    postsSection.innerHTML = ""; // Clear existing posts

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <p><strong>${post.user}</strong></p>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
            <small>${post.timestamp}</small>
            <button class="edit-btn" onclick="editPost(${index})">Edit</button>
            <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
        `;
        postsSection.appendChild(postElement);
    });
}

// Edit Post
function editPost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts[index];

    const newContent = prompt("Edit your post:", post.content);
    if (newContent !== null) {
        posts[index].content = newContent;
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();
    }
}

// Delete Post
function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

// Page Load - Check if user is logged in
window.onload = function () {
    if (currentUser) {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("post-section").classList.remove("hidden");
        document.getElementById("posts-section").classList.remove("hidden");
        loadPosts();
    }
};
