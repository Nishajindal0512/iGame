require("dotenv").config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const userRouter = require("./routes/userRoutes");
const gameRouter = require("./routes/gameRoutes");
const connectToDB = require("./database/connectToDB");
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB
connectToDB();

const app = express();
app.use(express.json());
app.use(cors());

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Routes
app.use("/api/users", userRouter);
app.use("/api/games", gameRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
