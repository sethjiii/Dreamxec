const axios = require('axios');

const sendWhatsAppMessage = async ({ to, message }) => {
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const baseUrl = process.env.EVOLUTION_API_URL;

  if (!baseUrl || !apiKey || !instanceName) {
    console.warn('Evolution API not configured (URL, KEY, or INSTANCE_NAME missing). SKIPPING WhatsApp send.');
    console.log('Mock WhatsApp -> To:', to, 'Message:', message);
    return;
  }

  try {
    const url = `${baseUrl}/message/sendText/${instanceName}`;
    
    const formattedNumber = to.replace(/\D/g, ''); 

    const payload = {
      number: formattedNumber,
      options: {
        delay: 1200,
        presence: "composing",
        linkPreview: false
      },
      textMessage: {
        text: message
      }
    };

    const config = {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(url, payload, config);
    console.log('WhatsApp sent successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};

module.exports = { sendWhatsAppMessage };
