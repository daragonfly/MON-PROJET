import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

// Vérifie que toutes les variables nécessaires sont présentes
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Missing required environment variables');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

export default sequelize;
