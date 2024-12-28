import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize'; // Assurez-vous que cette importation est correcte

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public points!: number; // Assurez-vous que la colonne "points" existe
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
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
  },
  {
    sequelize, 
    modelName: 'User',
    tableName: 'users', 
  }
);
export default User;

const insertUser = async () => {
  try {
  
    await sequelize.sync();

    const user = await User.create({
      username: 'admin',
      email: 'admin',
      password: 'admin',  
      points: 100,
    });

    console.log('Utilisateur créé:', user.toJSON());
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur:', error);
  } finally {
    await sequelize.close();
  }
};
//if need to insert user
// insertUser();

