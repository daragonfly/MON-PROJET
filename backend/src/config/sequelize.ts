import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config(); 

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST || 'localhost', 
      dialect: 'postgres',
    }
  );
  

export default sequelize;
