const express = require("express");
const app = express();
cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Set the default timezone to West African Time (Africa/Lagos)
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Africa/Lagos");

const customerLoginRouter = require("./auth/customers/login");
const customerSignupRouter = require("./auth/customers/signup");
const eateryLoginRouter = require("./auth/eateries/login");
const eaterySignupRouter = require("./auth/eateries/signup");
const foodItemsRouter = require("./controllers/foodItems");
const eateryOrderRouter = require("./controllers/eatery");
const customerRouter = require("./controllers/customer");
const customerOrderRouter = require("./controllers/order");
const foodCategories = require("./controllers/category");
const shortestPath = require("./test/shortpathApi");




app.use("/customer", customerLoginRouter);
app.use("/customer", customerSignupRouter);
app.use("/eatery", eateryLoginRouter);
app.use("/eatery", eaterySignupRouter);
app.use("/eateries", foodItemsRouter );
app.use("/eateries", eateryOrderRouter);
app.use("/customers", customerRouter);
app.use("/customers", customerOrderRouter);
app.use(foodCategories);
app.use(shortestPath);



// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
