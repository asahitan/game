// DOM Elements
const postInput = document.getElementById("post-input");
const imageInput = document.getElementById("image-input");
const postBtn = document.getElementById("post-btn");
const postsSection = document.getElementById("posts-section");
const themeToggle = document.getElementById("theme-toggle");

// Load posts from localStorage on page load
window.onload = function() {
    loadPosts();
    checkAuth(); // Check for user authentication
};

// Event listener for the "Post" button
postBtn.addEventListener("click", () => {
    const postContent = postInput.value.trim();
    const imageFile = imageInput.files[0];

    if (postContent === "" && !imageFile) {
        alert("Please write something or upload an image before posting!");
        return;
    }

    const post = {
        content: postContent,
        timestamp: new Date().toLocaleString(),
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        comments: [] // Initialize comments as an empty array
    };

    savePost(post);
    postInput.value = "";
    imageInput.value = ""; // Clear file input
    loadPosts();  // Reload posts after adding a new one
});

// Function to save the post to localStorage
function savePost(post) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

// Function to load posts from localStorage
function loadPosts() {
    postsSection.innerHTML = "";  // Clear previous posts
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image"/>` : ""}
            <small>${post.timestamp}</small>
            <button class="delete-btn" data-index="${index}">Delete</button>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <div class="comment-box">
                <input class="comment-input" type="text" placeholder="Add a comment" />
                <button class="comment-btn" data-index="${index}">Comment</button>
                <div class="comments-section" data-index="${index}">
                    ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join("")}
                </div>
            </div>
        `;

        postsSection.prepend(postElement);  // Add new post at the top
    });

    // Add event listeners to delete, edit, and comment buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            deletePost(index);
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            const postContent = posts[index].content;
            editPost(index, postContent);
        });
    });

    document.querySelectorAll(".comment-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const postIndex = e.target.dataset.index;
            addComment(postIndex);
        });
    });
}

// Function to delete a post
function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.splice(index, 1); // Remove the post
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts(); // Reload posts
}

// Function to edit a post
function editPost(index, currentContent) {
    postInput.value = currentContent;
    deletePost(index); // Remove the current post to allow for editing
}

// Function to add a comment
function addComment(postIndex) {
    const commentInput = document.querySelector(`.comments-section[data-index="${postIndex}"]`).previousElementSibling.querySelector('.comment-input');
    const commentText = commentInput.value.trim();

    if (commentText === "") {
        alert("Please write a comment before submitting!");
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[postIndex].comments.push(commentText); // Add the comment to the relevant post
    localStorage.setItem("posts", JSON.stringify(posts));
    commentInput.value = ""; // Clear the comment input
    loadPosts(); // Reload posts to display the new comment
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.querySelector(".container").classList.toggle("dark");

    // Toggle button text
    themeToggle.innerText = themeToggle.innerText === "Switch to Dark Mode" ? 
                            "Switch to Light Mode" : "Switch to Dark Mode";
});

// Firebase Configuration (replace with your config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// User Authentication
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log(`User is logged in: ${user.email}`);
        } else {
            console.log("No user is logged in.");
            auth.signInAnonymously().catch((error) => {
                console.error("Error signing in:", error);
            });
        }
    });
}
