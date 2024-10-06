const postInput = document.getElementById('post-input');
const imageInput = document.getElementById('image-input');
const postBtn = document.getElementById('post-btn');
const postsSection = document.getElementById('posts-section');

const API_URL = 'http://localhost:3000'; // Update this to your server URL

// Fetch posts from server
async function fetchPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();
    postsSection.innerHTML = '';  // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image"/>` : ""}
            <small>${post.timestamp}</small>
            <div class="comments-section" id="comments-${post.id}">
                <textarea class="comment-input" id="comment-input-${post.id}" placeholder="Add a comment..."></textarea>
                <button class="add-comment-btn" data-post-id="${post.id}">Add Comment</button>
            </div>
        `;

        postElement.querySelector('.add-comment-btn').addEventListener('click', () => addComment(post.id));
        postsSection.prepend(postElement);
        fetchComments(post.id); // Load comments for this post
    });
}

// Fetch comments for a specific post
async function fetchComments(postId) {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`);
    const comments = await res.json();
    const commentsSection = document.getElementById(`comments-${postId}`);

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p>${comment.content}</p>
            <small>${comment.timestamp}</small>
        `;

        commentsSection.appendChild(commentElement);
    });
}

// Add a new post
postBtn.addEventListener('click', async () => {
    const content = postInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!content && !imageFile) {
        alert('Please write something or upload an image!');
        return;
    }

    const timestamp = new Date().toLocaleString();
    const imageBase64 = imageFile ? await convertToBase64(imageFile) : null;

    const post = { content, image: imageBase64, timestamp };

    await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });

    postInput.value = '';
    imageInput.value = ''; // Clear the image input

    fetchPosts();  // Reload posts
});

// Convert image to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Add a comment to a post
async function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const content = commentInput.value.trim();

    if (!content) {
        alert('Please write a comment!');
        return;
    }

    const timestamp = new Date().toLocaleString();

    await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, timestamp })
    });

    commentInput.value = ''; // Clear the comment input
    fetchComments(postId); // Reload comments
}

// Load posts when the page is loaded
fetchPosts();
