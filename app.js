import express from 'express';
import sequelize from './config/database.js';
import routes from './routes/index.js';

// App = app, stupid.
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // We could be getting JSON at some point, the app needs to know what to do with it.
app.use(express.static("public")); // Serve public files
app.use("/", routes);

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error connecting to database:', err));
app.use('/api/tasks', routes); 

// Syncing
const syncDatabase = async () => {
    try {
      await sequelize.sync({ force: false }); // Use { force: true } to drop existing tables and recreate them. Maybe don't leave this one on.
      console.log('Created!');
    } catch (error) {
      console.error('Error creating database tables:', error);
    }
  };

// Port.
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await syncDatabase(); // Sync on start
  console.log(`Synced!`)
});

export default routes;