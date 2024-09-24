document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    const postButton = document.getElementById('post-btn');
    const postInput = document.getElementById('post-input');
    const postImage = document.getElementById('post-image');
    const feedList = document.getElementById('feed-list');

    // Load posts from localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Render existing posts
    posts.forEach(post => addPostToFeed(post));

    postButton.addEventListener('click', () => {
        const postContent = postInput.value.trim();
        const imageFile = postImage.files[0];

        if (postContent || imageFile) {
            const newPost = {
                id: posts.length + 1,
                content: postContent,
                image: imageFile ? URL.createObjectURL(imageFile) : null,
                likes: 0,
                dislikes: 0,
                comments: []
            };
            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts)); // Save posts to localStorage
            addPostToFeed(newPost);
            postInput.value = ''; // Clear input
            postImage.value = ''; // Clear image input
        } else {
            alert('Please enter some content or select an image.');
        }
    });

    function addPostToFeed(post) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
            <div>
                <button class="like-btn" data-id="${post.id}">👍 ${post.likes}</button>
                <button class="dislike-btn" data-id="${post.id}">👎 ${post.dislikes}</button>
                <span>Comments: <span class="comment-count">${post.comments.length}</span></span>
            </div>
            <div class="comment-section">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button class="comment-btn" data-id="${post.id}">Comment</button>
                <ul class="comments-list"></ul>
            </div>
        `;
        feedList.prepend(listItem);

        // Attach event listeners for likes, dislikes, and comments
        listItem.querySelector('.like-btn').addEventListener('click', handleLike);
        listItem.querySelector('.dislike-btn').addEventListener('click', handleDislike);
        listItem.querySelector('.comment-btn').addEventListener('click', handleComment);
    }

    function handleLike(event) {
        const postId = event.target.dataset.id;
        const post = posts.find(p => p.id == postId);
        if (post) {
            post.likes++;
            event.target.textContent = `👍 ${post.likes}`;
            localStorage.setItem('posts', JSON.stringify(posts)); // Update localStorage
        }
    }

    function handleDislike(event) {
        const postId = event.target.dataset.id;
        const post = posts.find(p => p.id == postId);
        if (post) {
            post.dislikes++;
            event.target.textContent = `👎 ${post.dislikes}`;
            localStorage.setItem('posts', JSON.stringify(posts)); // Update localStorage
        }
    }

    function handleComment(event) {
        const postId = event.target.dataset.id;
        const commentInput = event.target.previousElementSibling;
        const commentContent = commentInput.value.trim();

        if (commentContent) {
            const post = posts.find(p => p.id == postId);
            if (post) {
                post.comments.push(commentContent);
                addCommentToPost(postId, commentContent);
                commentInput.value = ''; // Clear input
                updateCommentCount(postId);
                localStorage.setItem('posts', JSON.stringify(posts)); // Update localStorage
            }
        } else {
            alert('Please enter a comment.');
        }
    }

    function addCommentToPost(postId, commentContent) {
        const postElement = Array.from(feedList.children).find(li => 
            li.querySelector('.comment-btn').dataset.id === postId
        );
        const commentsList = postElement.querySelector('.comments-list');
        const commentItem = document.createElement('li');
        commentItem.textContent = commentContent;
        commentsList.appendChild(commentItem);
    }

    function updateCommentCount(postId) {
        const post = posts.find(p => p.id == postId);
        const postElement = Array.from(feedList.children).find(li => 
            li.querySelector('.comment-btn').dataset.id === postId
        );
        const commentCountElement = postElement.querySelector('.comment-count');
        commentCountElement.textContent = post.comments.length;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    });
});
