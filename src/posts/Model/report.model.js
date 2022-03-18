const mongoose = require("mongoose");
const reportSchema = require("../Schema/report.schema");
const Report = mongoose.model("report", reportSchema);

module.exports = Report;
