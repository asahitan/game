// DOM Elements
const postInput = document.getElementById("post-input");
const imageInput = document.getElementById("image-input");
const postBtn = document.getElementById("post-btn");
const postsSection = document.getElementById("posts-section");
const themeToggle = document.getElementById("theme-toggle");

// Load posts from localStorage on page load
window.onload = function() {
    loadPosts();
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
        comments: []
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

            <div class="comments-section" id="comments-${index}">
                <textarea class="comment-input" id="comment-input-${index}" placeholder="Add a comment..."></textarea>
                <button class="add-comment-btn" data-index="${index}">Add Comment</button>
            </div>
        `;

        postElement.querySelector('.delete-btn').addEventListener('click', () => deletePost(index));
        postElement.querySelector('.edit-btn').addEventListener('click', () => editPost(index, post.content));
        postElement.querySelector('.add-comment-btn').addEventListener('click', () => addComment(index));

        postsSection.prepend(postElement);  // Add new post at the top

        loadComments(index, post.comments); // Load comments for each post
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

// Function to add a comment to a post
function addComment(postIndex) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const commentInput = document.getElementById(`comment-input-${postIndex}`);
    const commentContent = commentInput.value.trim();

    if (commentContent === "") {
        alert("Please write a comment!");
        return;
    }

    const comment = {
        content: commentContent,
        timestamp: new Date().toLocaleString(),
        replies: []
    };

    posts[postIndex].comments.push(comment);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();  // Reload posts after adding a comment
}

// Function to load comments
function loadComments(postIndex, comments) {
    const commentsSection = document.getElementById(`comments-${postIndex}`);

    comments.forEach((comment, commentIndex) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
            <p>${comment.content}</p>
            <small>${comment.timestamp}</small>
            <button class="reply-btn" data-post-index="${postIndex}" data-comment-index="${commentIndex}">Reply</button>

            <div class="replies-section" id="replies-${postIndex}-${commentIndex}"></div>

            <textarea class="reply-input" id="reply-input-${postIndex}-${commentIndex}" placeholder="Add a reply..."></textarea>
            <button class="add-reply-btn" data-post-index="${postIndex}" data-comment-index="${commentIndex}">Add Reply</button>
        `;

        commentElement.querySelector('.add-reply-btn').addEventListener('click', () => addReply(postIndex, commentIndex));
        commentsSection.appendChild(commentElement);

        loadReplies(postIndex, commentIndex, comment.replies); // Load replies for each comment
    });
}

// Function to add a reply to a comment
function addReply(postIndex, commentIndex) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const replyInput = document.getElementById(`reply-input-${postIndex}-${commentIndex}`);
    const replyContent = replyInput.value.trim();

    if (replyContent === "") {
        alert("Please write a reply!");
        return;
    }

    const reply = {
        content: replyContent,
        timestamp: new Date().toLocaleString()
    };

    posts[postIndex].comments[commentIndex].replies.push(reply);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();  // Reload posts after adding a reply
}

// Function to load replies
function loadReplies(postIndex, commentIndex, replies) {
    const repliesSection = document.getElementById(`replies-${postIndex}-${commentIndex}`);

    replies.forEach(reply => {
        const replyElement = document.createElement("div");
        replyElement.classList.add("comment-reply");
        replyElement.innerHTML = `
            <p>${reply.content}</p>
            <small>${reply.timestamp}</small>
        `;

        repliesSection.appendChild(replyElement);
    });
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.querySelector(".container").classList.toggle("dark");

    // Toggle button text
    themeToggle.innerText = themeToggle.innerText === "Switch to Dark Mode" ? 
                            "Switch to Light Mode" : "Switch to Dark Mode";
});
