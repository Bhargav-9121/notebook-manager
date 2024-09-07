const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const saltRounds = 10;

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "notepam",
});

app.post("/signup", (req, res) => {
  const { name, email, pass } = req.body;

  // Hash the password
  bcrypt.hash(pass, saltRounds, (err, hash) => {
    if (err) return res.json("Error hashing password");

    const sql =
      "INSERT INTO users (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [name, email, hash];

    db.query(sql, values, (err, data) => {
      if (err) return res.json("Error");
      return res.json(data);
    });
  });
});

const secretKey = process.env.JWT_SECRET;
// Store this in an env variable

app.post("/checkuser", (req, res) => {
  const { email, pass } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err || data.length === 0) {
      console.log("Error fetching user or user not found");
      return res.json("Failed");
    }

    // Debugging: log the data
    console.log("Fetched user data:", data);

    // Compare hashed password
    bcrypt.compare(pass, data[0].password, (err, result) => {
      if (err) {
        console.log("Error comparing passwords", err);
        return res.json("Failed");
      }

      // Log comparison result
      console.log("Password match result:", result);

      if (result) {
        // Create JWT token
        const token = jwt.sign({ id: data[0].userid }, secretKey, {
          expiresIn: "1h",
        });
        return res.json({ token, userid: data[0].userid });
      } else {
        return res.json("Failed");
      }
    });
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Use middleware in protected routes
app.post("/:userid/addbook", authenticateToken, (req, res) => {
  const sql = "INSERT INTO notebooks (userid) VALUES (?)";
  const values = [req.params.userid];
  db.query(sql, values, (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

app.get("/:userid/showbooks", authenticateToken, (req, res) => {
  const sql = "select * from notebooks where userid = (?)";
  const values = [req.params.userid];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.put("/:notebook_id/editbook", authenticateToken, (req, res) => {
  const sql =
    "update notebooks set notebook_name = (?) where notebook_id = (?)";
  const values = [req.body.newNotebookName, req.params.notebook_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/verifytoken", authenticateToken, (req, res) => {
  res.json({ userid: req.user.id });
});

app.delete("/:notebook_id/deletebook", authenticateToken, (req, res) => {
  const sql = "delete from notebooks where notebook_id = (?)";
  const values = [req.params.notebook_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/:notebook_id/addnotecard", authenticateToken, (req, res) => {
  const sql = "insert into notecards (`notebook_id`) values (?)";
  const values = [req.params.notebook_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.get("/:notebook_id/shownotecards", authenticateToken, (req, res) => {
  const sql = "select * from notecards where notebook_id = (?)";
  const values = [req.params.notebook_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.delete("/:notecard_id/deletenotecard", authenticateToken, (req, res) => {
  const sql = "delete from notecards where notecard_id = (?)";
  const values = [req.params.notecard_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.put("/:notecard_id/editnotecard", authenticateToken, (req, res) => {
  const sql = "update notecards set notecard_name = ? where notecard_id = ?";
  const values = [req.body.newNotecardName, req.params.notecard_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.put("/:notecard_id/savenotecontent", authenticateToken, (req, res) => {
  const sql = "update notecards set content = (?) where notecard_id = (?)";
  const values = [req.body.noteContent, req.params.notecard_id];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error saving note content:", err);
      return res.status(500).json("Error saving note content");
    }
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("listening on 8081");
});
