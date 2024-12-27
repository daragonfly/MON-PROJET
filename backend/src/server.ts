import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sequelize from './config/sequelize'; // Importer l'instance Sequelize
import User from './models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; // Importer Op depuis Sequelize
dotenv.config(); // Charger les variables d'environnement

const cors = require('cors');
const app = express();

app.use(cors());
// Initialiser l'application Express
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

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    console.log('Users fetched:', users); // Ajoute ce log pour vérifier
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

app.post('/api/users', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, points } = req.body;

  // Vérifier que tous les champs nécessaires sont présents
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, and password are required.' });
    return;
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      res.status(400).json({ message: 'Username already in use' });
      return;
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      points: points || 0, // Valeur par défaut pour points
    });

    // Réponse avec l'utilisateur créé (sans le mot de passe)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      points: newUser.points,
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});


app.post('/api/signup', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  // Vérifier que tous les champs nécessaires sont présents
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, and password are required.' });
    return;
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      points: 0, // Points par défaut
    });

    // Répondre avec l'utilisateur créé (sans le mot de passe)
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

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // Réponse avec le token
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email, points: user.points },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to log in user' });
  }
});

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

    user.points += points; // Incrémenter les points
    await user.save();

    res.status(200).json({ message: 'Points updated successfully.', points: user.points });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ message: 'Failed to update points.' });
  }
});


// Route pour récupérer le leaderboard
app.get('/api/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await User.findAll({
      order: [['points', 'DESC']], // Tri par points décroissants
      attributes: ['id', 'username', 'points'], // Sélectionner les colonnes nécessaires
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard.' });
  }
});

// Supprimer les utilisateurs en double
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

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
