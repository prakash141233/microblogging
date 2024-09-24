document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple authentication
        if (username === 'prakash' && password === '123') {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});
