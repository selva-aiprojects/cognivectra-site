import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const token = process.env.LINKEDIN_ACCESS_TOKEN;
if (!token) {
  console.error('No LINKEDIN_ACCESS_TOKEN found in .env');
  process.exit(1);
}

(async () => {
  try {
    console.log('Calling https://api.linkedin.com/v2/me');
    const me = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    console.log('== /v2/me response ==');
    console.log(JSON.stringify(me.data, null, 2));
  } catch (err) {
    console.error('Error calling /v2/me:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }

  try {
    console.log('\nCalling a minimal ugcPosts dry-run to check permissions (not creating a post)');
    const body = {
      lifecycleState: 'PUBLISHED',
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: 'Permission check: test' },
          shareMediaCategory: 'NONE'
        }
      }
    };
    const res = await axios.post('https://api.linkedin.com/v2/ugcPosts', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('== ugcPosts response ==');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error calling ugcPosts:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
})();
