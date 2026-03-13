import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './api/.env' });

const createAdmin = async () => {
  try {
    console.log('🔌 Connecting to API server...');
    
    // Wait for server to be ready
    let retries = 5;
    while (retries > 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/create-admin', {
          name: 'Admin',
          email: 'belalmohamedyousry@gmail.com',
          password: 'BelalAdmin123!', // Change this to your secure password
        });

        console.log('✅ Admin created successfully!');
        console.log('📧 Email:', 'belalmohamedyousry@gmail.com');
        console.log('🔐 Password:', 'BelalAdmin123!');
        console.log('\n🎯 You can now login with these credentials!');
        break;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          retries--;
          if (retries > 0) {
            console.log(`⏳ Server not ready, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            throw new Error('❌ Failed to connect to API server. Make sure it is running on port 5000');
          }
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.response?.data || error.message);
    process.exit(1);
  }
};

createAdmin();
