// src/models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // Assure-toi que l'importation de Sequelize est correcte

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Assure-toi que le nom de la table est correct
    timestamps: true,
  }
);

export default User;
