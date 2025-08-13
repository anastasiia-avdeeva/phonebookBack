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
  number: {
    type: String,
    required: [true, "A number is required"],
    validate: {
      validator: function (v) {
        if (v.length < 8) return false;
        return /^\d{2,3}-\d{6,}$/.test(v);
      },
      message: (props) => {
        if (props.value.length < 8)
          return "Number must be at least 8 digits long";
        return `${props.value} is not a valid phone number!`;
      },
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
