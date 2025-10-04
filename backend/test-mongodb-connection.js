// Test MongoDB Connection
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  console.log('💡 Make sure to add your MongoDB connection string to .env');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 Connecting to:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

const testConnection = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    const connection = await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('🏠 Host:', connection.connection.host);
    console.log('📊 Database:', connection.connection.name);
    
    // Test basic operation
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    const testDoc = new TestModel({ message: 'Hello from Portfolio CMS!' });
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    console.log('🎉 MongoDB is ready for your Portfolio CMS!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Check your connection string in .env file');
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testConnection();
