// Quick diagnostic script to check if server setup is correct
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking backend server setup...\n');

// Check 1: Required files exist
console.log('1. Checking required files...');
const requiredFiles = [
  'server.js',
  'package.json',
  'routes/StudentRoutes.js',
  'routes/StudentUploadRoutes.js',
  'models/Student.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

// Check 2: .env file exists
console.log('\n2. Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('MONGODB_URI')) {
    console.log('   ✅ MONGODB_URI found in .env');
  } else {
    console.log('   ⚠️  MONGODB_URI not found in .env');
  }
} else {
  console.log('   ❌ .env file MISSING!');
  console.log('   Create a .env file with:');
  console.log('   MONGODB_URI=your_mongodb_connection_string');
  console.log('   PORT=5000');
}

// Check 3: node_modules exists
console.log('\n3. Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules exists');
  
  // Check for required packages
  const requiredPackages = ['express', 'mongoose', 'multer', 'xlsx', 'bcryptjs'];
  requiredPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`   ✅ ${pkg} installed`);
    } else {
      console.log(`   ❌ ${pkg} NOT installed - run: npm install`);
    }
  });
} else {
  console.log('   ❌ node_modules MISSING!');
  console.log('   Run: npm install');
}

// Check 4: Uploads directory
console.log('\n4. Checking uploads directory...');
const uploadsPath = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsPath)) {
  console.log('   ✅ uploads directory exists');
} else {
  console.log('   ⚠️  uploads directory will be created automatically');
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('✅ Basic setup looks good!');
  console.log('\nTo start the server, run:');
  console.log('   npm run dev');
  console.log('\nThen test the API at:');
  console.log('   http://localhost:5000/api/test');
} else {
  console.log('❌ Some files are missing. Please check the errors above.');
}
console.log('='.repeat(50));

