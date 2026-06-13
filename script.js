const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");

const flagParts = ["CTF", "{", "ikan", "_", "cupang", "_", "cantik", "}"];
const correctAnswers = ["cupang", "ikan cupang"];

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (correctAnswers.includes(userAnswer)) {
    result.style.color = "#22c55e";
    result.textContent = "Benar! Flag: " + flagParts.join("");
  } else {
    result.style.color = "#ef4444";
    result.textContent = "Salah. Coba perhatikan bentuk ikan hias di dalam gambar.";
  }
}

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
