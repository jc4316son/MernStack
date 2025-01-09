import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('MongoDB connected successfully');
    
    // Create a simple model
    const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
    
    // Try to save a document
    await Test.create({ name: 'test' });
    console.log('Test document created successfully');
    
    // Cleanup
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();
