import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('\n🔍 Checking Local Setup...\n');

// Check 1: Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1)) < 18) {
  console.log('   ⚠️  Warning: Node.js v18+ recommended');
}

// Check 2: Dependencies
const nodeModulesPath = path.join(projectRoot, 'node_modules');
if (existsSync(nodeModulesPath)) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies missing - run: npm install');
}

// Check 3: .env file
const envPath = path.join(projectRoot, '.env');
if (existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL');
    const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY');
    
    if (hasSupabaseUrl && hasSupabaseKey) {
      console.log('✅ Supabase environment variables found');
    } else {
      console.log('❌ Missing Supabase variables in .env');
      if (!hasSupabaseUrl) console.log('   Missing: VITE_SUPABASE_URL');
      if (!hasSupabaseKey) console.log('   Missing: VITE_SUPABASE_ANON_KEY');
    }
  } catch (err) {
    console.log('⚠️  Could not read .env file');
  }
} else {
  console.log('❌ .env file missing');
  console.log('   Create .env file in project root with:');
  console.log('   VITE_SUPABASE_URL=...');
  console.log('   VITE_SUPABASE_ANON_KEY=...');
}

// Check 4: Required files
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'src/main.jsx',
  'src/App.jsx',
  'index.html'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check 5: Port availability (basic check)
console.log('\n💡 Quick Fixes:');
console.log('   1. If dev server won\'t start: npm install');
console.log('   2. If blank page: Check browser console (F12)');
console.log('   3. If Supabase errors: Verify .env variables');
console.log('   4. If port in use: npm run dev -- --port 3000');
console.log('\n📖 See docs/TROUBLESHOOTING.md for detailed help\n');
