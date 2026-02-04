/*****************
 * 기본 설정
 *****************/
const ADMIN_CODE = "DRIVER_OK_2026";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbx_Nb4GIyL6oblNTKtA73s8oxaNnJyFI5vFZZJZpb9VBhMGqq2cnlaZulkUF_zKwobm/exec"; // ← 중요
const TARGET_MIN = 80000;
const TARGET_MAX = 90000;

/*****************
 * 상태 관리
 *****************/
let state = JSON.parse(localStorage.getItem("lottoState")) || {
  phone: "",
  recommend: "",
  chance: 6,
  point: 0
};

function save() {
  localStorage.setItem("lottoState", JSON.stringify(state));
}

/*****************
 * DOM
 *****************/
const phoneInput = document.getElementById("phone");
const recInput = document.getElementById("recommend");
const drawBtn = document.getElementById("drawBtn");
const machine = document.getElementById("machine");
const chanceEl = document.getElementById("chance");
const pointEl = document.getElementById("point");
const exchangeEl = document.getElementById("exchange");

/*****************
 * 렌더링
 *****************/
function render() {
  chanceEl.innerText = state.chance;
  pointEl.innerText = state.point.toLocaleString();
  exchangeEl.style.display = state.point >= 100000 ? "block" : "none";
  drawBtn.disabled = !state.phone || state.chance <= 0;
}

/*****************
 * 유틸
 *****************/
function validPhone(v) {
  return /^010\d{8}$/.test(v);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/*****************
 * 구글 시트 전송
 *****************/
function sendToSheet() {
  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      phone: state.phone,
      point: state.point,
      chance: state.chance,
      recommend: state.recommend
    })
  });
}

/*****************
 * 입력 처리
 *****************/
window.savePhone = function () {
  const v = phoneInput.value.replace(/[^0-9]/g, "");
  if (!validPhone(v)) {
    alert("휴대폰 번호를 정확히 입력해주세요.");
    return;
  }
  state.phone = v;
  save();
  render();
};

window.saveRecommend = function () {
  const v = recInput.value.replace(/[^0-9]/g, "");
  if (!validPhone(v)) {
    alert("추천 기사 휴대폰 번호를 정확히 입력해주세요.");
    return;
  }
  state.recommend = v;
  save();
  alert("추천 기사 번호가 등록되었습니다.\n가입 확인 후 기회가 추가됩니다.");
};

/*****************
 * 보상 계산
 *****************/
function getReward() {
  if (state.chance === 1) {
    let min = TARGET_MIN - state.point;
    let max = TARGET_MAX - state.point;
    min = Math.max(1000, min);
    max = Math.max(min, max);
    return Math.floor((Math.random() * (max - min) + min) / 1000) * 1000;
  }
  return pick([8000, 9000, 10000, 12000, 15000]);
}

/*****************
 * 추첨
 *****************/
drawBtn.onclick = () => {
  if (state.chance <= 0) return;

  const gain = getReward();
  state.chance -= 1;
  state.point += gain;

  const ball = document.createElement("div");
  ball.className = "ball";
  ball.innerText = gain / 10000 + "만";
  machine.appendChild(ball);

  save();
  render();
  sendToSheet(); // ⭐ 구글 시트 기록
};

/*****************
 * 관리자 승인
 *****************/
window.adminAdd = function () {
  const code = document.getElementById("adminCode").value;
  if (code !== ADMIN_CODE) {
    alert("잘못된 코드입니다.");
    return;
  }
  if (!state.recommend) {
    alert("추천 기사 번호가 없습니다.");
    return;
  }

  state.chance += 1;
  save();
  render();
  sendToSheet();

  alert(
    "추천 기사 가입 확인 완료!\n" +
    "추천 기사 번호: " + state.recommend + "\n" +
    "추첨 기회 1회 추가"
  );
};

/*****************
 * 초기화
 *****************/
if (state.phone) phoneInput.value = state.phone;
if (state.recommend) recInput.value = state.recommend;
render();
