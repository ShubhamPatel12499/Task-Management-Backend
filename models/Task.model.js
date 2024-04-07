const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    taskName: { type: String, required: true },
    status: { type: String, enum: ["Tasks", "In-progress", "Done", "Rework"], default: "Tasks"},
    date: { type: Date, default: Date.now }
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = {
    taskModel
};