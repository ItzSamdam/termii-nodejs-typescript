import NodeTermii from './src/termiiClient';  // Ensure the correct import path for your library

async function runExample() {
    // Initialize the NodeTermii client with your API key
    const client = new NodeTermii('YOUR_API_KEY');

    try {
        // Example 1: Check Account Balance
        const balance = await client.balance();
        console.log('Account Balance:', balance);

        // Example 2: Query Phone Number Status
        const phoneStatus = await client.status(1234567890, 'NG');
        console.log('Phone Status:', phoneStatus);

        // Example 3: Get Message History
        const history = await client.history();
        console.log('Message History:', history);

        // Example 4: Check DND Status
        const dndStatus = await client.search(1234567890);
        console.log('DND Status:', dndStatus);

        // Example 5: Get All Sender IDs
        const senderIds = await client.allSenderId();
        console.log('Sender IDs:', senderIds);

        // Example 6: Submit a New Sender ID
        const senderIdResponse = await client.submitSenderId('NewSender', 'Marketing', 'MyCompany');
        console.log('Sender ID Submission Response:', senderIdResponse);

        // Example 7: Send a Message
        const sendMessageResponse = await client.sendMessage(1234567890, 'NewSender', 'Hello! This is a test message.');
        console.log('Send Message Response:', sendMessageResponse);

    } catch (error) {
        console.error('Error:', error.message || error);
    }
}

// Execute the example function
runExample();
