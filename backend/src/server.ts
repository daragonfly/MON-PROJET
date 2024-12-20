import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import speakeasy from 'speakeasy'; // MFA
import qr from 'qr-image'; // Utilisation de qr-image pour générer le QR code
import sequelize from './config/sequelize'; // Importer l'instance Sequelize
import User from './models/User';  
import bcrypt from 'bcryptjs';

dotenv.config(); // Charger les variables d'environnement

// Initialiser l'application Express
const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(express.json());

// Test de connexion avec Sequelize
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected to PostgreSQL'))
  .catch((err) => console.error('❌ Sequelize connection error:', err.message));


sequelize.sync({ force: false }) // Si force: true, cela va supprimer la table existante avant de la recréer
.then(() => {
  console.log('✅ Database & tables synchronized');
})
.catch((err) => {
  console.error('❌ Error synchronizing database:', err.message);
});
// Route pour vérifier le token MFA
app.post('/api/mfa/verify', (req, res) => {
  const { token, secret } = req.body;

  // Vérification du token en utilisant le secret généré
  const isVerified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });

  if (isVerified) {
    res.json({ message: 'MFA token verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid MFA token' });
  }
});

// Route pour créer un utilisateur
app.get('/api/users', async (req: Request, res: Response) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  app.get('/api/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });
// Routes existantes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/api/package', (req, res) => {
  res.json({
    message: 'Here is your package data!',
    packages: ['package1', 'package2', 'package3'],
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
