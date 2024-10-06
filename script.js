// Initial setup: display posts and check theme
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme + '-theme';
    document.getElementById('themeToggle').checked = theme === 'dark';
});

function addPost() {
    const statusText = document.getElementById('status').value;
    const imageUpload = document.getElementById('imageUpload').files[0];

    if (!statusText && !imageUpload) {
        alert("You must write something or upload an image!");
        return;
    }

    const reader = new FileReader();
    
    reader.onloadend = function () {
        const imgData = imageUpload ? reader.result : null;

        const post = {
            id: Date.now(), // Unique ID for the post
            text: statusText,
            image: imgData,
            timestamp: new Date().toLocaleString()
        };

        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));

        document.getElementById('status').value = '';
        document.getElementById('imageUpload').value = '';
        displayPosts();
    };

    if (imageUpload) {
        reader.readAsDataURL(imageUpload);
    } else {
        reader.onloadend();
    }
}

function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const timestamp = document.createElement('small');
        timestamp.innerText = post.timestamp;

        const text = document.createElement('p');
        text.innerText = post.text;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deletePost(post.id);

        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.innerText = 'Edit';
        editButton.onclick = () => editPost(post.id);

        postElement.appendChild(timestamp);
        postElement.appendChild(text);
        postElement.appendChild(deleteButton);
        postElement.appendChild(editButton);

        if (post.image) {
            const img = document.createElement('img');
            img.src = post.image;
            postElement.appendChild(img);
        }

        postsContainer.appendChild(postElement);
    });
}

function deletePost(id) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

function editPost(id) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id === id);

    const newText = prompt("Edit your post:", post.text);
    if (newText !== null && newText.trim() !== "") {
        post.text = newText;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

function toggleTheme() {
    const isDark = document.getElementById('themeToggle').checked;
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
