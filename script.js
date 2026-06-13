const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");

const flagParts = ["CTF", "{", "anak", "_", "cupang", "}"];
const correctAnswer = "anak cupang";

function normalizeAnswer(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkAnswer() {
  const userAnswer = normalizeAnswer(answerInput.value);

  if (userAnswer === correctAnswer) {
    result.style.color = "#22c55e";
    result.textContent = "Benar! Flag: " + flagParts.join("");
  } else {
    result.style.color = "#ef4444";
    result.textContent = "Salah. Coba perhatikan gambar dan hint-nya lagi.";
  }
}

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
