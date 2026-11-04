import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout instead of hanging
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Warning: ${error.message}`);
    if (error.message.includes('whitelist') || error.message.includes('ServerSelectionError')) {
      console.warn(`
--------------------------------------------------------------------------------------
⚠️  MONGODB ATLAS IP ACCESS NOTICE:
Your MongoDB Atlas cluster requires your current IP or Render IP to be whitelisted:
1. Log in to https://cloud.mongodb.com
2. In the left sidebar, click 'Network Access' (under Security)
3. Click '+ ADD IP ADDRESS'
4. Click 'ALLOW ACCESS FROM ANYWHERE' (0.0.0.0/0) and click 'Confirm'
5. Wait 1-2 minutes for Atlas to deploy the change, then restart/refresh.
--------------------------------------------------------------------------------------
      `);
    }
  }
};

export const checkConnection = () => isConnected || mongoose.connection.readyState === 1;

export default connectDB;
