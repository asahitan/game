// app.js

// Load posts from localStorage on page load
document.addEventListener('DOMContentLoaded', loadPosts);

const postBtn = document.getElementById('post-btn');
const postContent = document.getElementById('post-content');
const feed = document.getElementById('feed');

// Function to handle post submission
postBtn.addEventListener('click', function() {
    const content = postContent.value.trim();
    
    if (content !== '') {
        const post = {
            content: content,
            timestamp: new Date().toLocaleString()
        };
        
        savePostToLocalStorage(post);
        displayPost(post);
        postContent.value = '';  // Clear the textarea
    } else {
        alert('Please write something before posting.');
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
    
    const postTimestamp = document.createElement('small');
    postTimestamp.textContent = post.timestamp;
    
    postDiv.appendChild(postContent);
    postDiv.appendChild(postTimestamp);
    feed.prepend(postDiv);
}

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    posts.forEach(post => {
        displayPost(post);
    });
}
