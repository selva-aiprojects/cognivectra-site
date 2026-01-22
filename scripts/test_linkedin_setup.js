import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

console.log('=== LinkedIn Configuration Check ===');
console.log('Client ID:', clientId ? '✅ Present' : '❌ Missing');
console.log('Client Secret:', clientSecret ? '✅ Present' : '❌ Missing');
console.log('Access Token:', accessToken ? '✅ Present' : '❌ Missing');

if (!clientId || !clientSecret || !accessToken) {
  console.error('\n❌ Missing required LinkedIn credentials');
  process.exit(1);
}

(async () => {
  try {
    console.log('\n=== Testing Current Access Token ===');
    
    // Test 1: Get profile info
    console.log('Testing /v2/me endpoint...');
    const meResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    console.log('✅ Profile access successful:');
    console.log('   Name:', `${meResponse.data.localizedFirstName} ${meResponse.data.localizedLastName}`);
    console.log('   ID:', meResponse.data.id);

    // Test 2: Check posting permissions with a dry run
    console.log('\nTesting posting permissions...');
    
    const testPost = {
      author: `urn:li:person:${meResponse.data.id}`,
      lifecycleState: 'DRAFT', // Use DRAFT for testing
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: 'Test post - permission check' },
          shareMediaCategory: 'NONE'
        }
      }
    };

    const postResponse = await axios.post('https://api.linkedin.com/v2/ugcPosts', testPost, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Posting permissions successful:');
    console.log('   Post ID:', postResponse.data.id);
    console.log('   Status:', postResponse.data.lifecycleState);

    // Clean up the test post
    await axios.delete(`https://api.linkedin.com/v2/ugcPosts/${postResponse.data.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('✅ Test post cleaned up');

  } catch (error) {
    console.error('\n❌ LinkedIn API Error:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
      
      if (error.response.status === 403) {
        console.log('\n💡 Suggestion: Access token may lack required permissions');
        console.log('   Required scopes: profile, w_member_social');
      } else if (error.response.status === 401) {
        console.log('\n💡 Suggestion: Access token may be expired');
        console.log('   Try generating a new token from LinkedIn Developer Console');
      }
    } else {
      console.error('   Error:', error.message);
    }
  }

  console.log('\n=== Next Steps ===');
  console.log('1. If tests pass ✅ - LinkedIn integration is ready');
  console.log('2. If tests fail ❌ - Check app permissions in LinkedIn Developer Console');
  console.log('3. Make sure "Ugc Posts" product is added to your LinkedIn app');
  console.log('4. Verify OAuth scopes include: profile, w_member_social');
})();
