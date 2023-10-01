import CryptoJS, { SHA256 } from "crypto-js";

const API_URL = "http://localhost:5050";

const calculateHash = (text, iterations) => {
  let hash = text;
  for (let i = 0; i < iterations; ++i) {
    console.log(i);
    hash = SHA256(hash).toString(CryptoJS.enc.Hex);
  }
  return hash;
};

const fetchCurrentIteration = async (username) => {
  const response = await fetch(`${API_URL}/getCurrentIteration?username=${username}`);
  const data = await response.json();
  return data.currentIteration;
};

const registerUser = async (username, hash100) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, hash: hash100 }),
  });
  const data = await response.json();
  return data.status;
};

const loginUser = async (username, currentHash) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, hash: currentHash }),
  });
  const data = await response.json();
  return data.status;
};

// Register Manually

let hash100Register = 0;

const calculateHash100 = () => {
  const hash = calculateHash(document.getElementById("passwordRegister").value, 100);
  document.getElementById("hash100").innerHTML = hash;
  hash100Register = hash;
};

const register = async () => {
  const status = await registerUser(
    document.getElementById("usernameRegister").value,
    hash100Register
  );
  document.getElementById("statusRegister").innerHTML = status;
};

// Register Automatically

const registerAuto = async () => {
  const hash = calculateHash(document.getElementById("passwordRegisterAuto").value, 100);
  const status = await registerUser(
    document.getElementById("usernameRegisterAuto").value,
    hash
  );
  document.getElementById("statusRegisterAuto").innerHTML = status;
};

// Login Manually

let currentIterationLogin = 0;
let currentHashLogin = "";

const getCurrentIteration = async () => {
  const iteration = await fetchCurrentIteration(
    document.getElementById("usernameLogin").value
  );
  document.getElementById("currentIteration").innerHTML = iteration;
  currentIterationLogin = iteration;
};

const calculateCurrentHash = () => {
  const hash = calculateHash(
    document.getElementById("passwordLogin").value,
    currentIterationLogin
  );
  document.getElementById("hashCurrent").innerHTML = hash;
  currentHashLogin = hash;
};

const login = async () => {
  const status = await loginUser(
    document.getElementById("usernameLogin").value,
    currentHashLogin
  );
  document.getElementById("statusLogin").innerHTML = status;
};

// Login Automatically

const loginAuto = async () => {
  const iteration = await fetchCurrentIteration(
    document.getElementById("usernameLoginAuto").value
  );
  const hash = calculateHash(
    document.getElementById("passwordLoginAuto").value,
    iteration
  );
  const status = await loginUser(
    document.getElementById("usernameLoginAuto").value,
    hash
  );
  document.getElementById("statusLoginAuto").innerHTML = status;
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calculateHash100").onclick = calculateHash100;
  document.getElementById("register").onclick = register;
  document.getElementById("registerAuto").onclick = registerAuto;
  document.getElementById("getCurrentIteration").onclick = getCurrentIteration;
  document.getElementById("calculateCurrentHash").onclick = calculateCurrentHash;
  document.getElementById("login").onclick = login;
  document.getElementById("loginAuto").onclick = loginAuto;
});
