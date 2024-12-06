// login.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email,
        password
    };

    // Send data to backend API for login
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });

    const result = await response.json();

    // Display message based on response
    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.textContent = `Login successful! Welcome back, ${result.username}`;
        messageElement.style.color = 'green';
    } else {
        messageElement.textContent = `Error: ${result.message}`;
        messageElement.style.color = 'red';
    }
});
