const express = require('express');
const bodyParser = require('body-parser');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express();
app.use(bodyParser.json());

const serviceClient = new WebPubSubServiceClient('Endpoint=https://azurewebpubsub.webpubsub.azure.com;AccessKey=hSm9DSLxXWiP2qJFPLCaagFICDaRBhaY7E9WfMf3A5c=;Version=1.0;', 'azureHub');

// Function to generate random JSON responses
function generateResponse() {
  return { value: Math.floor(Math.random() * 100) };
}

// Endpoint to trigger response generation and send to Azure Web PubSub
app.post('/generate', async (req, res) => {
  const response = generateResponse();
  console.log('New Response Generated:', response);
  
  try {
    await serviceClient.sendToAll('newResponse', JSON.stringify(response));
    res.status(200).send({ message: 'Response generated and sent to Azure Web PubSub.' });
  } catch (error) {
    console.error('Error sending response to Azure Web PubSub:', error);
    res.status(500).send({ error: 'Failed to send response to Azure Web PubSub.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
