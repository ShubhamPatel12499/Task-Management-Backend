const Validator = async (req, res, next) => {
    const { taskName, status, date } = req.body;

    if (!taskName || taskName.trim() === "") {
        return res.status(400).send("Task name is required");
    }

    const allowedStatusValues = ["Tasks", "In-progress", "Done", "Rework"];
    if (!allowedStatusValues.includes(status) && !allowedStatusValues.includes(status.toLowerCase())) {
        return res.status(400).send('Invalid status value');
    }

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).send("Invalid date format");
    }

    next();
};

module.exports = {
    Validator
};