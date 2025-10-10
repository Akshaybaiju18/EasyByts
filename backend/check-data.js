// check-data.js
const mongoose = require('mongoose');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('\n📋 PROJECTS:');
    const projects = await Project.find({});
    console.log(`Total projects: ${projects.length}`);
    projects.forEach(p => {
      console.log(`- ${p.title} (Status: ${p.status}) (ID: ${p._id})`);
    });
    
    console.log('\n📝 BLOG POSTS:');
    const posts = await BlogPost.find({});
    console.log(`Total blog posts: ${posts.length}`);
    posts.forEach(p => {
      console.log(`- ${p.title} (Status: ${p.status}) (ID: ${p._id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkData();
