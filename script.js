// DOM Elements
const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("post-btn");
const postsSection = document.getElementById("posts-section");

// Load posts from localStorage on page load
window.onload = function() {
    loadPosts();
};

// Event listener for the "Post" button
postBtn.addEventListener("click", () => {
    const postContent = postInput.value.trim();

    if (postContent === "") {
        alert("Please write something before posting!");
        return;
    }

    const post = {
        content: postContent,
        timestamp: new Date().toLocaleString(),
    };

    savePost(post);
    postInput.value = "";
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
        postElement.innerHTML = `<p>${post.content}</p><small>${post.timestamp}</small>`;
        postsSection.prepend(postElement);  // Add new post at the top
    });
}
