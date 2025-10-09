// create-test-data.js
// Script to create sample skills and blog posts for testing

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Sample Skills Data
const sampleSkills = [
  // Frontend Skills
  {
    name: 'React',
    category: 'Frontend',
    level: 'Advanced',
    proficiency: 85,
    description: 'Building modern, interactive user interfaces with React hooks and context',
    yearsOfExperience: 3,
    icon: '⚛️',
    color: '#61dafb',
    featured: true,
    status: 'active'
  },
  {
    name: 'JavaScript',
    category: 'Frontend',
    level: 'Advanced',
    proficiency: 90,
    description: 'ES6+, async/await, DOM manipulation, and modern JavaScript patterns',
    yearsOfExperience: 4,
    icon: '🟨',
    color: '#f7df1e',
    featured: true,
    status: 'active'
  },
  {
    name: 'CSS3',
    category: 'Frontend',
    level: 'Advanced',
    proficiency: 80,
    description: 'Flexbox, Grid, animations, responsive design, and CSS preprocessors',
    yearsOfExperience: 4,
    icon: '🎨',
    color: '#1572b6',
    featured: true,
    status: 'active'
  },

  // Backend Skills
  {
    name: 'Node.js',
    category: 'Backend',
    level: 'Intermediate',
    proficiency: 75,
    description: 'Server-side JavaScript, Express.js, RESTful APIs, and middleware',
    yearsOfExperience: 2,
    icon: '🟢',
    color: '#339933',
    featured: true,
    status: 'active'
  },
  {
    name: 'Express.js',
    category: 'Backend',
    level: 'Intermediate',
    proficiency: 70,
    description: 'Web application framework, routing, authentication, and API development',
    yearsOfExperience: 2,
    icon: '🚀',
    color: '#000000',
    featured: false,
    status: 'active'
  },

  // Database Skills
  {
    name: 'MongoDB',
    category: 'Database',
    level: 'Intermediate',
    proficiency: 65,
    description: 'NoSQL database design, aggregation pipelines, and Mongoose ODM',
    yearsOfExperience: 1.5,
    icon: '🍃',
    color: '#47a248',
    featured: false,
    status: 'active'
  },
  {
    name: 'MySQL',
    category: 'Database',
    level: 'Intermediate',
    proficiency: 60,
    description: 'Relational database design, complex queries, and performance optimization',
    yearsOfExperience: 2,
    icon: '🐬',
    color: '#4479a1',
    featured: false,
    status: 'active'
  },

  // Tools
  {
    name: 'Git & GitHub',
    category: 'Tools',
    level: 'Advanced',
    proficiency: 85,
    description: 'Version control, branching strategies, pull requests, and collaboration',
    yearsOfExperience: 3,
    icon: '📦',
    color: '#f05032',
    featured: true,
    status: 'active'
  },
  {
    name: 'VS Code',
    category: 'Tools',
    level: 'Expert',
    proficiency: 95,
    description: 'Code editor mastery, extensions, debugging, and productivity shortcuts',
    yearsOfExperience: 4,
    icon: '💻',
    color: '#007acc',
    featured: false,
    status: 'active'
  }
];

// Sample Blog Posts Data
const sampleBlogPosts = [
  {
    title: 'Building a Full-Stack Portfolio with React and Node.js',
    excerpt: 'Learn how to create a modern portfolio website with CMS capabilities using React, Node.js, and MongoDB. Complete with authentication, CRUD operations, and responsive design.',
    content: `# Building a Full-Stack Portfolio with React and Node.js

In this comprehensive tutorial, we'll build a complete portfolio website with CMS capabilities from scratch.

## What We'll Build

- **Frontend**: React application with routing and components
- **Backend**: Node.js API with Express and MongoDB
- **Features**: Project showcase, skills display, blog functionality
- **CMS**: Admin dashboard for content management

## Prerequisites

Before we start, make sure you have:
- Node.js installed (v16 or higher)
- Basic knowledge of JavaScript and React
- Understanding of REST APIs
- MongoDB Atlas account (free tier)

## Setting Up the Backend

First, let's create our Express server...

\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
\`\`\`

## Creating the Frontend

Next, we'll set up our React application...

This tutorial covers everything you need to know to build a professional portfolio!`,
    author: {
      name: 'Your Name',
      email: 'your.email@example.com'
    },
    category: 'Web Development',
    tags: ['react', 'nodejs', 'mongodb', 'tutorial', 'portfolio'],
    status: 'published',
    featured: true,
    readTime: 12
  },
  {
    title: 'Modern JavaScript: ES6+ Features Every Developer Should Know',
    excerpt: 'Explore the most important ES6+ features that will make your JavaScript code more elegant, readable, and efficient. From arrow functions to async/await.',
    content: `# Modern JavaScript: ES6+ Features Every Developer Should Know

JavaScript has evolved significantly over the years. Let's explore the most important modern features.

## Arrow Functions

Arrow functions provide a more concise syntax:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## Template Literals

Template literals make string interpolation much easier:

\`\`\`javascript
const name = 'John';
const greeting = \`Hello, \${name}!\`;
\`\`\`

## Destructuring

Extract values from arrays and objects:

\`\`\`javascript
const [first, second] = [1, 2];
const {name, age} = {name: 'John', age: 30};
\`\`\`

## Async/Await

Handle asynchronous operations more elegantly:

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

These features will make your JavaScript code more modern and maintainable!`,
    author: {
      name: 'Your Name',
      email: 'your.email@example.com'
    },
    category: 'JavaScript',
    tags: ['javascript', 'es6', 'programming', 'tutorial'],
    status: 'published',
    featured: true,
    readTime: 8
  },
  {
    title: 'React Hooks: A Complete Guide',
    excerpt: 'Master React Hooks with practical examples. Learn useState, useEffect, useContext, and custom hooks to build better React applications.',
    content: `# React Hooks: A Complete Guide

React Hooks revolutionized how we write React components. Let's explore the most important ones.

## useState Hook

Manage state in functional components:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

Handle side effects:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
\`\`\`

## Custom Hooks

Create reusable logic:

\`\`\`jsx
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
\`\`\`

Hooks make React components more powerful and reusable!`,
    author: {
      name: 'Your Name',
      email: 'your.email@example.com'
    },
    category: 'React',
    tags: ['react', 'hooks', 'frontend', 'tutorial'],
    status: 'published',
    featured: false,
    readTime: 10
  }
];

async function createTestData() {
  try {
    console.log('🎯 Creating sample skills and blog posts...');

    // Create Skills
    console.log('\n📋 Creating skills...');
    for (const skill of sampleSkills) {
      try {
        const response = await axios.post(`${API_BASE}/skills`, skill);
        console.log(`✅ Created skill: ${skill.name}`);
      } catch (error) {
        console.log(`❌ Failed to create skill: ${skill.name}`, error.response?.data?.message);
      }
    }

    // Create Blog Posts
    console.log('\n📝 Creating blog posts...');
    for (const post of sampleBlogPosts) {
      try {
        const response = await axios.post(`${API_BASE}/blog`, post);
        console.log(`✅ Created blog post: ${post.title}`);
      } catch (error) {
        console.log(`❌ Failed to create blog post: ${post.title}`, error.response?.data?.message);
      }
    }

    console.log('\n🎉 Test data creation completed!');
    console.log('\n📊 Summary:');
    console.log(`Skills: ${sampleSkills.length} created`);
    console.log(`Blog Posts: ${sampleBlogPosts.length} created`);

    console.log('\n🧪 Test your APIs:');
    console.log('GET /api/skills - View all skills');
    console.log('GET /api/skills/categories - View skill categories');
    console.log('GET /api/blog - View all blog posts');
    console.log('GET /api/blog/categories - View blog categories');

  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  }
}

createTestData();