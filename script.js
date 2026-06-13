const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");

const flagParts = ["CTF", "{", "rumah", "_", "di", "_", "tengah", "_", "lingkaran", "}"];
const correctAnswer = "rumah";

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer === correctAnswer) {
    result.style.color = "#22c55e";
    result.textContent = "Benar! Flag: " + flagParts.join("");
  } else {
    result.style.color = "#ef4444";
    result.textContent = "Salah. Coba perhatikan bentuk putih di tengah gambar.";
  }
}

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
