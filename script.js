let score = 0;
let timeLeft = 10;
let timer;

const scoreEl = document.getElementById("score");
const resultEl = document.getElementById("result");
const tapBtn = document.getElementById("tapBtn");
const startBtn = document.getElementById("startBtn");
const refEl = document.getElementById("referrer");

// 추천인 표시
const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");
if (ref) {
  refEl.innerText = `📩 ${ref} 기사님의 초대`;
}

tapBtn.addEventListener("click", () => {
  score++;
  scoreEl.innerText = score;
});

startBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 10;
  scoreEl.innerText = 0;
  resultEl.innerText = "";
  tapBtn.disabled = false;
  startBtn.disabled = true;

  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) endGame();
  }, 1000);
});

function endGame() {
  clearInterval(timer);
  tapBtn.disabled = true;
  startBtn.disabled = false;

  const point = score * 100;
  resultEl.innerHTML = `
    🎉 ${point} 포인트 획득!<br>
    기사 등록 시 프로그램비 차감으로 사용 가능합니다.
  `;

  // 👉 여기서 ref + 점수 서버로 보내면 고도화 가능
  console.log("추천인:", ref, "포인트:", point);
}
