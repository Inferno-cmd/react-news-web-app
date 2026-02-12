import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noticeboard';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

let db;
let postsCollection;
let adminsCollection;
let usersCollection;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('noticeboard');
    postsCollection = db.collection('posts');
    adminsCollection = db.collection('admins');
    usersCollection = db.collection('users');
    
    // Create indexes
    try {
      await postsCollection.createIndex({ category: 1 });
      await postsCollection.createIndex({ status: 1 });
      await postsCollection.createIndex({ createdAt: -1 });
      await usersCollection.createIndex({ email: 1 }, { unique: true });
    } catch (indexError) {
      console.log('Index creation note:', indexError.message);
    }
    
    console.log('Connected to MongoDB');
    
    // Initialize admin user if not exists
    try {
      const adminExists = await adminsCollection.findOne({ username: 'admin' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
        const adminResult = await adminsCollection.insertOne({
          username: 'admin',
          email: 'admin@localhost',
          password: hashedPassword,
          createdAt: new Date(),
          role: 'admin'
        });
        console.log('Admin user created with ID:', adminResult.insertedId);
      } else {
        console.log('Admin user already exists');
      }
    } catch (adminError) {
      console.error('Admin initialization error:', adminError.message);
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}

// JWT verification middleware
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('Registration attempt for:', email);
    
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    console.log('Creating new user...');
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'user',
      posts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('User created with ID:', result.insertedId);
    console.log('Generating token...');
    
    const token = jwt.sign(
      { id: result.insertedId.toString(), role: 'user', email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log('Registration successful for:', email);
    res.status(201).json({ token, user: { id: result.insertedId, email, name, role: 'user' } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unified Login (Admin and User)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check admin login first
    if (email === 'admin') {
      console.log('Checking admin user...');
      const admin = await adminsCollection.findOne({ username: 'admin' });
      
      if (!admin) {
        console.log('Admin not found in database');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      console.log('Admin found, checking password...');
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        console.log('Password mismatch for admin');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Admin password correct, generating token...');
      const token = jwt.sign(
        { id: admin._id.toString(), role: 'admin', username: admin.username, email: 'admin' }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      console.log('Token generated for admin');
      return res.json({ token, user: { id: admin._id, username: admin.username, email: 'admin', role: 'admin' } });
    }

    // Check user login
    console.log('Checking user in database:', email);
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('User found, checking password...');
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid password' });
    }

    console.log('User password correct, generating token...');
    const token = jwt.sign(
      { id: user._id.toString(), role: 'user', email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log('Token generated for user:', email);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'user' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user info
app.get('/api/auth/me', verifyAdmin, async (req, res) => {
  try {
    // Check if admin or user
    let user = await adminsCollection.findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      user = await usersCollection.findOne({ _id: new ObjectId(req.userId) });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login (deprecated, kept for compatibility)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const admin = await adminsCollection.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id.toString(), role: 'admin', username: admin.username }, JWT_SECRET, {
      expiresIn: '24h'
    });
    
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts (public, filtered by status)
app.get('/api/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = { status: 'approved' };
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const posts = await postsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await postsCollection.countDocuments(filter);
    
    res.json({
      posts,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await postsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, description, category, location, contact, email, phone } = req.body;
    
    if (!title || !description || !category || !contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newPost = {
      title,
      description,
      category,
      location,
      contact,
      email,
      phone,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await postsCollection.insertOne(newPost);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  const categories = [
    'Jobs',
    'Rentals',
    'Events',
    'Announcements',
    'Lost & Found'
  ];
  res.json(categories);
});

// Admin: Get all posts (pending, approved, rejected)
app.get('/api/admin/posts', verifyAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const posts = await postsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await postsCollection.countDocuments(filter);
    
    res.json({
      posts,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update post status
app.patch('/api/admin/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete post
app.delete('/api/admin/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await postsCollection.deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Edit post
app.put('/api/admin/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, category, location, contact, email, phone } = req.body;
    
    const result = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          title,
          description,
          category,
          location,
          contact,
          email,
          phone,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
