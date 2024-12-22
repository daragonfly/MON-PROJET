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
      defaultValue: 0, // Valeur par défaut de points
    },
  },
  {
    sequelize, // L'instance Sequelize
    modelName: 'User', // Nom du modèle
    tableName: 'users', // Nom de la table dans la base de données
  }
);
export default User;

const insertUser = async () => {
  try {
    // Synchroniser le modèle avec la base de données (si nécessaire)
    await sequelize.sync();

    // Créer un utilisateur
    const user = await User.create({
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',  // Assure-toi de hasher les mots de passe dans un vrai cas d'utilisation
      points: 100,
    });

    console.log('Utilisateur créé:', user.toJSON());
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur:', error);
  } finally {
    // Fermer la connexion Sequelize
    await sequelize.close();
  }
};

// Exécuter la fonction pour insérer un utilisateur
//insertUser();
