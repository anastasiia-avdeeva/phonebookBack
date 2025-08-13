const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log(result);
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
    console.log("error connecting to MongoDB:", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
    minLength: [3, "Name must be at least 3 characters long"],
    trim: true,
  },
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
