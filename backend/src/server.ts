import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sequelize from './config/sequelize';
import User from './models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const cors = require('cors');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
    },
    servers: [
      {
        url: 'http://localhost:3010',
      },
    ],
  },
  apis: ['./src/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());

const port = process.env.PORT || 3010;
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected to PostgreSQL'))
  .catch((err) => console.error('❌ Sequelize connection error:', err.message));

sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Database & tables synchronized');
  })
  .catch((err) => {
    console.error('❌ Error synchronizing database:', err.message);
  });

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The user ID
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         points:
 *           type: number
 *           description: The points of the user
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    console.log('Users fetched:', users); // Add this log to verify
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/api/package', (req, res) => {
  res.json({
    message: 'Here is your package data!',
    packages: ['package1', 'package2', 'package3'],
  });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               points:
 *                 type: number
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create user
 */
app.post('/api/users', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, points } = req.body;

  // Check if all required fields are present
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, and password are required.' });
    return;
  }

  try {
    // Check if email already exists
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      res.status(400).json({ message: 'Username already in use' });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      points: points || 0, // Default value for points
    });

    // Respond with the created user (without the password)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      points: newUser.points,
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create user
 */
app.post('/api/signup', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  // Check if all required fields are present
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, and password are required.' });
    return;
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      points: 0, // Default points
    });

    // Respond with the created user (without the password)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      points: newUser.points,
    });
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - identifier
 *               - password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid identifier or password
 *       500:
 *         description: Failed to log in user
 */
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ message: 'Identifier and password are required.' });
    return;
  }

  try {
    const user = await User.findOne({ where: { [Op.or]: [{ username: identifier }, { email: identifier }] } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid identifier or password.' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email, points: user.points },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to log in user' });
  }
});

/**
 * @swagger
 * /api/users/{id}/points:
 *   put:
 *     summary: Update user points
 *     description: Updates the points of a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *             required:
 *               - points
 *     responses:
 *       200:
 *         description: Points updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 points:
 *                   type: number
 *       400:
 *         description: ID and points are required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update points
 */
app.put('/api/users/:id/points', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { points } = req.body;

  if (!id || points === undefined) {
    res.status(400).json({ message: 'ID and points are required.' });
    return;
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.points += points; // Increment points
    await user.save();

    res.status(200).json({ message: 'Points updated successfully.', points: user.points });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ message: 'Failed to update points.' });
  }
});

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     description: Retrieves the leaderboard
 *     responses:
 *       200:
 *         description: A list of users sorted by points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch leaderboard
 */
app.get('/api/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await User.findAll({
      order: [['points', 'DESC']],
      attributes: ['id', 'username', 'points'],
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard.' });
  }
});

/**
 * @swagger
 * /api/users/duplicates:
 *   delete:
 *     summary: Delete duplicate users
 *     description: Deletes duplicate users based on username and email
 *     responses:
 *       200:
 *         description: Duplicate users deleted successfully
 *       500:
 *         description: Failed to delete duplicate users
 */
app.delete('/api/users/duplicates', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    const usernames = users.map(user => user.username);
    const duplicateUsernames = usernames.filter((username, index) => usernames.indexOf(username) !== index);

    const emails = users.map(user => user.email);
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);

    if (duplicateUsernames.length > 0) {
      await User.destroy({ where: { username: duplicateUsernames } });
    }

    if (duplicateEmails.length > 0) {
      await User.destroy({ where: { email: duplicateEmails } });
    }

    res.status(200).json({ message: 'Duplicate users deleted successfully.' });
  } catch (error) {
    console.error('Error deleting duplicate users:', error);
    res.status(500).json({ message: 'Failed to delete duplicate users.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
