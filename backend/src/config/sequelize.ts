import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

const sequelize = new Sequelize(
    process.env.DB_NAME!, // Utilisation de "!" pour dire à TypeScript que cette variable est définie
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST || 'localhost', // Utiliser 'localhost' par défaut si l'hôte n'est pas défini
      dialect: 'postgres',
    }
  );
  

export default sequelize; // Exporter l'instance de Sequelize
