// signup.js

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        username,
        email,
        password
    };

    // Send data to backend API for signup
    const response = await fetch('http://localhost:5500/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const result = await response.json();

    // Display message based on response
    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.textContent = `Signup successful! Welcome, ${result.username}`;
        messageElement.style.color = 'green';
    } else {
        messageElement.textContent = `Error: ${result.message}`;
        messageElement.style.color = 'red';
    }
});
