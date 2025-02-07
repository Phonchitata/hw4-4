const quizKey = "quizData";

const quiz = {
    id: "uniqueID",
    questions: [
        { id: 1, text: "1 + 1 เท่ากับเท่าไหร่?", choices: ["1", "2", "3", "4"], correct: "2" },
        { id: 2, text: "3 + 5 เท่ากับเท่าไหร่?", choices: ["5", "7", "8", "10"], correct: "8" },
        { id: 3, text: "เมืองหลวงของไทยคือ?", choices: ["เชียงใหม่", "กรุงเทพฯ", "ภูเก็ต", "ขอนแก่น"], correct: "กรุงเทพฯ" },
        { id: 4, text: "2 × 3 เท่ากับเท่าไหร่?", choices: ["5", "6", "7", "8"], correct: "6" },
        { id: 5, text: "ดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุดคือ?", choices: ["โลก", "อังคาร", "พุธ", "ศุกร์"], correct: "พุธ" },
        { id: 6, text: "6 ÷ 2 เท่ากับเท่าไหร่?", choices: ["2", "3", "4", "5"], correct: "3" },
        { id: 7, text: "กรุงเทพฯอยู่ภาคอะไรของไทย?", choices: ["เหนือ", "กลาง", "ใต้", "ตะวันออก"], correct: "กลาง" },
        { id: 8, text: "สีของท้องฟ้าคือ?", choices: ["แดง", "เขียว", "ฟ้า", "เหลือง"], correct: "ฟ้า" },
        { id: 9, text: "1 + (2 × 3) เท่ากับ?", choices: ["7", "9", "6", "5"], correct: "7" },
        { id: 10, text: "ใครคือผู้คิดค้นไฟฟ้า?", choices: ["ไอน์สไตน์", "นิวตัน", "เอดิสัน", "เทสลา"], correct: "เอดิสัน" },
        { id: 11, text: "9 - 5 เท่ากับเท่าไหร่?", choices: ["3", "4", "5", "6"], correct: "4" },
        { id: 12, text: "10 ÷ 2 เท่ากับเท่าไหร่?", choices: ["2", "5", "6", "8"], correct: "5" },
        { id: 13, text: "7 × 3 เท่ากับเท่าไหร่?", choices: ["14", "21", "28", "35"], correct: "21" },
        { id: 14, text: "8 + 7 เท่ากับเท่าไหร่?", choices: ["13", "14", "15", "16"], correct: "15" },
        { id: 15, text: "12 - 4 เท่ากับเท่าไหร่?", choices: ["6", "7", "8", "9"], correct: "8" },
        { id: 16, text: "5 × 4 เท่ากับเท่าไหร่?", choices: ["15", "20", "25", "30"], correct: "20" },
        { id: 17, text: "18 ÷ 3 เท่ากับเท่าไหร่?", choices: ["4", "5", "6", "7"], correct: "6" },
        { id: 18, text: "9 + 8 เท่ากับเท่าไหร่?", choices: ["15", "16", "17", "18"], correct: "17" },
        { id: 19, text: "20 - 9 เท่ากับเท่าไหร่?", choices: ["10", "11", "12", "13"], correct: "11" },
        { id: 20, text: "4 × 5 เท่ากับเท่าไหร่?", choices: ["15", "20", "25", "30"], correct: "20" }
    ],
    timeLimit: 60, // วินาที
    passingScore: 60
};

saveToLocalStorage(quizKey, quiz);

let selectedQuestions = [];
let timer;
let timeRemaining = quiz.timeLimit;

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("submitQuiz").addEventListener("click", submitQuiz);

function startQuiz() {
    document.getElementById("results").classList.add("hidden");
    selectedQuestions = shuffleArray(getFromLocalStorage(quizKey).questions).slice(0, 5);
    displayQuestions();
    startTimer();
}

function displayQuestions() {
    const questionContainer = document.getElementById("quizForm");
    questionContainer.innerHTML = "";
    selectedQuestions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";
        questionDiv.innerHTML = `<p>${index + 1}. ${q.text}</p>`;
        q.choices.forEach(choice => {
            questionDiv.innerHTML += `
                <label>
                    <input type="radio" name="q${q.id}" value="${choice}">
                    ${choice}
                </label><br>`;
        });
        questionContainer.appendChild(questionDiv);
    });
    document.getElementById("quizContainer").classList.remove("hidden");
}

function startTimer() {
    timeRemaining = quiz.timeLimit;
    document.getElementById("timer").textContent = `เวลาที่เหลือ: ${timeRemaining} วินาที`;
    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `เวลาที่เหลือ: ${timeRemaining} วินาที`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    clearInterval(timer);
    let score = 0;
    let unansweredQuestions = [];

    selectedQuestions.forEach((q, index) => {
        const selectedAnswer = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (!selectedAnswer) {
            unansweredQuestions.push(index + 1); // ใช้ index+1 เพื่อให้แสดงเลขที่สุ่มมา 5 ข้อ
        } else if (selectedAnswer.value === q.correct) {
            score++;
        }
    });

    if (unansweredQuestions.length > 0) {
        alert(`กรุณาตอบคำถามข้อที่: ${unansweredQuestions.join(", ")} ก่อนส่งคำตอบ`);
        return;
    }
    const percentageScore = (score / selectedQuestions.length) * 100;
    displayResults(score, percentageScore);
}

function displayResults(score, percentage) {
    document.getElementById("quizContainer").classList.add("hidden");
    let resultsDiv = document.getElementById("results");
    let message = `<h2>คะแนนของคุณ: ${score}/${selectedQuestions.length} (${percentage}%)</h2>`;
    message += percentage >= quiz.passingScore ? "<p>ผ่านการทดสอบ ✅</p>" : "<p>ไม่ผ่าน ❌</p>";
    message += "<h3>เฉลย:</h3>";
    selectedQuestions.forEach(q => {
        message += `<div class="question">
            <p>${q.text}</p>
            <p>คำตอบที่ถูกต้อง: <strong>${q.correct}</strong></p>
        </div>`;
    });
    resultsDiv.innerHTML = message;
    resultsDiv.classList.remove("hidden");
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}