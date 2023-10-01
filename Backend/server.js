const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const app = express();
const db = require("./database");

const HTTP_PORT = 5050;

app.use(cors());
app.use(express.json());

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.post("/register", (req, res, next) => {
  const stmt = db.prepare(
    "INSERT INTO user (username, currentHash, currentIteration) VALUES (?, ?, 99)"
  );
  try {
    stmt.run(req.body.username, req.body.hash);
    res.json({ status: "User successfully created" });
  } catch (e) {
    res.status(401).json({ status: "Username already exists" });
  }
});

app.post("/login", (req, res, next) => {
  // get currentHash and currentIteration from user
  let hashServer = "";
  let currentIteration;
  const selectStmt = db.prepare(
    "SELECT currentHash, currentIteration FROM user WHERE username = ?"
  );
  try {
    const row = selectStmt.get(req.body.username);
    hashServer = row.currentHash;
    currentIteration = row.currentIteration;
  } catch (e) {
    res.status(401).json({ status: "Login failed" });
    return;
  }
  // calculate hi+1
  nextHash = CryptoJS.SHA256(req.body.hash).toString(CryptoJS.enc.Hex);

  // compare calculated hash with hashServer and check if currentIteration is greater than 0
  if (nextHash === hashServer && currentIteration > 0) {
    // update hash and iteration
    updateStmt = db.prepare(
      "UPDATE user SET currentHash = ?, currentIteration = currentIteration - 1 WHERE username = ?"
    );
    updateStmt.run(req.body.hash, req.body.username);
    res.json({ status: "Login successful" });
  } else {
    // brute force potential, either decrement iteration on fail or add blacklist
    res.status(404).json({ status: "Login failed" });
  }
});

app.get("/getCurrentIteration", (req, res, next) => {
  const stmt = db.prepare("SELECT currentIteration FROM user WHERE username = ?");
  try {
    const row = stmt.get(req.query.username);
    res.json({ currentIteration: row.currentIteration });
  } catch (e) {
    // return pseudorandom index from 1-99, so that user cannot find valid users
    res.json({ currentIteration: Math.floor(Math.random() * 99) + 1 });
  }
});

// default response for invalid route
app.use((req, res) => res.status(404));
