const express = require("express");
const { taskModel } = require("../models/Task.model");
const { Validator } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const taskRouter = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');

taskRouter.get("/getTasks", async (req, res) => {
    try {
        let query = {};
        if (req.query.startDate && req.query.endDate) {
            query.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const data = await taskModel.find(query);
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching tasks");
    }
});

taskRouter.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
      const task = await taskModel.findById(taskId);
      if (!task) {
          return res.status(404).send("Task not found");
      }
      res.status(200).send(task);
  } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching task");
  }
});

taskRouter.get('/download/:status', async (req, res) => {
    const { status } = req.params;
    try {
      const tasks = await taskModel.find({ status });
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(`${status}_tasks.pdf`);
      doc.pipe(stream);
      doc.fontSize(16).text(`Tasks with status: ${status}`, { align: 'center' }).moveDown();
      tasks.forEach(task => {
        doc.fontSize(12).text(`Task Name: ${task.taskName}`);
        doc.fontSize(10).text(`Status: ${task.status}`);
        doc.fontSize(10).text(`Date: ${task.date}`);
        doc.moveDown();
      });
      doc.end();
  
      stream.on('finish', () => {
        res.setHeader('Content-Disposition', `attachment; filename=${status}_tasks.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(`${status}_tasks.pdf`, { root: '.' });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
    }
});

taskRouter.post("/addTask", Validator, async (req, res) => {
    const payload = req.body;
    try {
        const newTask = new taskModel(payload);
        await newTask.save();
        res.status(201).send("Task added successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding task");
    }
});

 taskRouter.patch('/updateStatus/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
  
    try {
      await taskModel.findByIdAndUpdate(taskId, { status });
  
      res.status(200).send('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).send('Internal server error');
    }
});

 taskRouter.patch('/updateTask/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { taskName, date, status } = req.body;

    try {
      const updatedTask = await taskModel.findByIdAndUpdate(taskId, { taskName, date, status }, { new: true });
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Internal server error');
    }
});

taskRouter.delete('/delete/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await taskModel.findByIdAndDelete(taskId);

    res.status(200).send('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Internal server error');
  }
});


module.exports = {
    taskRouter
};
