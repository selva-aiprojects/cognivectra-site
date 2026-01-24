import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

console.log('=== Getting Your LinkedIn Member ID ===\n');

if (!accessToken) {
    console.error('❌ Missing LINKEDIN_ACCESS_TOKEN');
    process.exit(1);
}

async function getMemberInfo() {
    try {
        // Get user profile info
        const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('✅ Successfully retrieved your LinkedIn info:\n');
        console.log('Name:', response.data.name);
        console.log('Email:', response.data.email);
        console.log('Sub (Member ID):', response.data.sub);

        console.log('\n📝 Update your .env file:');
        console.log(`LINKEDIN_PERSON_URN=urn:li:person:${response.data.sub}`);
        console.log('\nOr try the newer format:');
        console.log(`LINKEDIN_PERSON_URN=urn:li:member:${response.data.sub}`);

    } catch (error) {
        console.error('❌ Error getting member info:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

getMemberInfo();
