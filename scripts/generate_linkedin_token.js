import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

console.log('=== LinkedIn Access Token Generator ===');
console.log('Client ID:', clientId);

if (!clientId || !clientSecret) {
  console.error('❌ Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env');
  process.exit(1);
}

// Generate the authorization URL
const redirectUri = 'http://localhost:3000/callback'; // You'll need to add this to your LinkedIn app
const scopes = ['profile', 'w_member_social', 'openid', 'email'];
const state = Math.random().toString(36).substring(7); // Random state for security

const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `scope=${scopes.join(' ')}&` +
  `state=${state}`;

console.log('\n=== Step 1: Authorize the App ===');
console.log('1. Open this URL in your browser:');
console.log(authUrl);
console.log('\n2. Log in to LinkedIn and authorize the app');
console.log('3. You will be redirected to: ' + redirectUri);
console.log('4. Copy the "code" parameter from the URL');

console.log('\n=== Step 2: Exchange Code for Access Token ===');
console.log('After you get the authorization code, run:');
console.log(`node ${__filename} --exchange-code YOUR_CODE_HERE`);

// Handle code exchange
if (process.argv.includes('--exchange-code')) {
  const codeIndex = process.argv.indexOf('--exchange-code') + 1;
  const authCode = process.argv[codeIndex];
  
  if (!authCode) {
    console.error('❌ Please provide the authorization code');
    console.log('Usage: node test_linkedin_setup.js --exchange-code YOUR_CODE');
    process.exit(1);
  }

  exchangeCodeForToken(authCode);
}

async function exchangeCodeForToken(code) {
  try {
    console.log('\n=== Exchanging Code for Access Token ===');
    
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/callback',
      client_id: clientId,
      client_secret: clientSecret
    };

    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = response.data;
    
    console.log('✅ Access Token Generated Successfully!');
    console.log('Token:', access_token.substring(0, 50) + '...');
    console.log('Expires in:', expires_in, 'seconds');
    
    console.log('\n=== Update Your .env File ===');
    console.log('Replace LINKEDIN_ACCESS_TOKEN with:');
    console.log(`LINKEDIN_ACCESS_TOKEN=${access_token}`);
    
    console.log('\n=== Test the New Token ===');
    console.log('Run: node scripts/test_linkedin_setup.js');
    
  } catch (error) {
    console.error('❌ Error exchanging code for token:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}
