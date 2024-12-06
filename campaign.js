// script.js

// Handle form submission
document.getElementById('campaignForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const target_amount = document.getElementById('target_amount').value;

    const campaignData = {
        title,
        description,
        target_amount
    };

    // Send data to the backend API
    const response = await fetch('http://localhost:3000/api/campaign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
    });

    const result = await response.json();
    
    // Display message based on the response
    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.textContent = `Campaign created successfully with ID: ${result.campaignId}`;
        messageElement.style.color = 'green';
    } else {
        messageElement.textContent = `Error: ${result.message}`;
        messageElement.style.color = 'red';
    }
});
