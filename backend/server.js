
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
<<<<<<< HEAD
app.use('/api/tasks', require('./routes/taskRoutes'));
=======
//app.use('/api/tasks', require('./routes/taskRoutes'));
>>>>>>> 6acaafe9b9fc5f71347a09db32b43a6f1f423e99

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
