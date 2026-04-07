const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// connect to MongoDB using environment variable
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// define schema and model
const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});
const Task = mongoose.model('Task', taskSchema);

// route to get tasks grouped by status
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
