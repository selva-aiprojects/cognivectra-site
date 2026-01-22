import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const companyUrn = process.env.LINKEDIN_COMPANY_URN;
const personUrn = process.env.LINKEDIN_PERSON_URN;

console.log('=== LinkedIn Post Creation Test ===');
console.log('Access Token:', accessToken ? '✅ Present' : '❌ Missing');
console.log('Company URN:', companyUrn ? '✅ Present' : '❌ Missing');
console.log('Person URN:', personUrn ? '✅ Present' : '❌ Missing');

if (!accessToken) {
  console.error('❌ Missing LINKEDIN_ACCESS_TOKEN in .env');
  process.exit(1);
}

async function createTestPost() {
  try {
    // Choose author: Company page if available, otherwise personal profile
    const authorUrn = companyUrn || personUrn;
    const postType = companyUrn ? 'Company Page' : 'Personal Profile';
    
    console.log(`\n=== Creating Test Post on ${postType} ===`);
    console.log('Author URN:', authorUrn);

    const postContent = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      },
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `🚀 Testing LinkedIn API Integration - ${new Date().toLocaleString()}\n\n✅ This is an automated test post from CogniVectra's social media system.\n\n#API #Integration #Testing #CogniVectra`
          },
          shareMediaCategory: 'NONE'
        }
      }
    };

    console.log('Post content prepared...');
    
    const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postContent, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Post created successfully!');
    console.log('Post ID:', response.data.id);
    console.log('Status:', response.data.lifecycleState);
    console.log('Post URL:', `https://www.linkedin.com/feed/update/${response.data.id}/`);
    
    return response.data;

  } catch (error) {
    console.error('\n❌ Post creation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
      
      if (error.response.status === 403) {
        console.log('\n💡 Possible solutions:');
        console.log('1. Check if UGC product is enabled in LinkedIn app');
        console.log('2. Verify access token has w_member_social scope');
        console.log('3. Ensure you have posting permissions for this account');
      } else if (error.response.status === 401) {
        console.log('\n💡 Access token may be expired. Generate a new one:');
        console.log('node scripts/generate_linkedin_token.js');
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
createTestPost();
