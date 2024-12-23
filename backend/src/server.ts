import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sequelize from './config/sequelize'; // Importer l'instance Sequelize
import User from './models/User';  
import bcrypt from 'bcryptjs';

dotenv.config(); // Charger les variables d'environnement

// Initialiser l'application Express
const app = express();
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

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});