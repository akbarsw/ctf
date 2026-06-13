const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");
const stepIndicator = document.getElementById("step-indicator");
const hint = document.getElementById("hint");
const challengeImage = document.getElementById("challenge-image");
const question = document.getElementById("question");

let currentStep = 1;
let authToken = null;
let lastSubmit = 0;

const steps = {
  1: {
    question: "Perhatikan gambar berikut. Apa yang ada di dalam bingkai biru? (Format: tulis nama ikannya)",
    hint: "Hint: ikan hias kecil yang terkenal agresif dan warnanya cantik.",
    showImage: true,
    imageSrc: "step3.png"
  },
  2: {
    question: "Berapa jumlah huruf vokal (a, e, i, o, u) dalam kalimat 'kecerdasan buatan'?",
    hint: "Hint: Hitung huruf a, e, i, o, u saja. Spasi tidak dihitung.",
    showImage: false
  }
};

function updateUI() {
  const step = steps[currentStep];
  stepIndicator.textContent = `Step ${currentStep}/2`;
  question.textContent = step.question;
  hint.textContent = step.hint;
  challengeImage.style.display = step.showImage ? "block" : "none";
  if (step.showImage) {
    const img = challengeImage.querySelector('img');
    img.src = step.imageSrc;
  }
}

async function checkAnswer() {
  const now = Date.now();
  if (now - lastSubmit < 3000) {
    result.style.color = "#f59e0b";
    result.textContent = "Tunggu 3 detik sebelum submit lagi...";
    return;
  }
  lastSubmit = now;

  const userAnswer = answerInput.value;
  if (!userAnswer.trim()) {
    result.style.color = "#ef4444";
    result.textContent = "Masukkan jawaban!";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";
  result.style.color = "#94a3b8";
  result.textContent = "Memproses...";

  try {
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: currentStep,
        answer: userAnswer,
        token: authToken
      })
    });

    const data = await res.json();

    if (res.status === 429) {
      result.style.color = "#f59e0b";
      result.textContent = data.error;
      return;
    }

    if (data.correct) {
      result.style.color = "#22c55e";
      result.textContent = data.message;

      if (data.flag) {
        result.innerHTML = `🎉 Flag: <code>${data.flag}</code>`;
        submitBtn.textContent = "Selesai!";
        submitBtn.disabled = true;
        answerInput.disabled = true;
        return;
      }

      authToken = data.token;
      currentStep++;
      answerInput.value = "";
      setTimeout(() => {
        updateUI();
        result.textContent = "";
      }, 1500);
    } else {
      result.style.color = "#ef4444";
      result.textContent = data.message;
    }
  } catch (err) {
    result.style.color = "#ef4444";
    result.textContent = "Error: " + err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
}

submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

updateUI();
