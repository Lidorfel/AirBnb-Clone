const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const UserModel = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);
app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
  } catch (e) {
    res.status(422).json(e);
  }

  res.json(userDoc);
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc) {
    res.status(422).json("not found");
  }
  const passOk = await bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    res.status(422).json("password not ok");
  }
  jwt.sign(
    { email: userDoc.email, id: userDoc._id },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json(userDoc);
    }
  );
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.json(null);
  } else {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, tokenData) => {
      if (err) throw err;
      const { name, email, id } = await UserModel.findById(tokenData.id);
      res.json({ name, email, id });
    });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//FzwX6q6czPpOKlN7
app.listen(4000);
