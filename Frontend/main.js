import { SHA256 } from "crypto-js";

export function calculate() {
  const input = document.getElementById("input").value;
  const hash = SHA256(input);
  document.getElementById("output").textContent = hash;
}






document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('calculate');
  button.onclick = calculate;
});