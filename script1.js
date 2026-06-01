// College Habesha SAT Prep System
document.addEventListener("DOMContentLoaded", () => {
  const quizDiv = document.getElementById("quiz");
  const resultsDiv = document.getElementById("results");
  const dashboardDiv = document.getElementById("dashboard");

  if (!quizDiv || !resultsDiv || !dashboardDiv) return; // Only run on satprep.html

  // --- Question Bank (shortened for demo, expand as needed) ---
  const modules = {
    Math: [
      { q: "Solve: 2x + 3 = 7", options: ["x=2", "x=3", "x=4"], answer: "x=2", explanation: "Subtract 3 → 2x=4 → x=2." },
      { q: "Slope of y=2x+1?", options: ["1", "2", "3"], answer: "2", explanation: "Slope is the coefficient of x." },
      { q: "Factor: x^2-9", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-1)(x-9)"], answer: "(x-3)(x+3)", explanation: "Difference of squares." },
      { q: "Value of √49?", options: ["6", "7", "8"], answer: "7", explanation: "Square root of 49 is 7." }
    ],
    Reading: [
      { q: "Main idea of a passage?", options: ["Details", "Central theme", "Examples"], answer: "Central theme", explanation: "Main idea = overall theme." },
      { q: "Tone of persuasive essay?", options: ["Neutral", "Convincing", "Sarcastic"], answer: "Convincing", explanation: "Persuasive aims to convince." }
    ],
    Writing: [
      { q: "Correct: 'He go to school yesterday.'", options: ["He goes", "He went", "He gone"], answer: "He went", explanation: "Past tense required." },
      { q: "Fix: 'Its raining today.'", options: ["It's raining today", "Its' raining today", "It rains today"], answer: "It's raining today", explanation: "Contraction for 'it is'." }
    ],
    Science: [
      { q: "Water boils at ___ °C?", options: ["50", "100", "150"], answer: "100", explanation: "At sea level." },
      { q: "DNA is located in?", options: ["Nucleus", "Cytoplasm", "Ribosome"], answer: "Nucleus", explanation: "DNA stored in nucleus." }
    ],
    Vocabulary: [
      { q: "Meaning of 'ephemeral'?", options: ["Short-lived", "Eternal", "Confusing"], answer: "Short-lived", explanation: "Ephemeral = fleeting." },
      { q: "Synonym of 'benevolent'?", options: ["Kind", "Cruel", "Neutral"], answer: "Kind", explanation: "Benevolent = kind." }
    ],
    Logic: [
      { q: "If all cats are mammals, Tom is a cat. Tom is a ___?", options: ["Bird", "Mammal", "Reptile"], answer: "Mammal", explanation: "Logical deduction." },
      { q: "True/False: If A→B and A is true, then B must be true.", options: ["True", "False"], answer: "True", explanation: "Modus ponens." }
    ]
  };

  // --- Load Module Function ---
  window.loadModule = function(moduleName) {
    quizDiv.innerHTML = "";
    resultsDiv.innerHTML = "";
    const questions = modules[moduleName];
    let score = 0;

    questions.forEach((item, index) => {
      const qDiv = document.createElement("div");
      qDiv.classList.add("question");
      qDiv.innerHTML = `<p><strong>${index+1}. ${item.q}</strong></p>`;
      
      item.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.classList.add("option");
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === item.answer) {
            score++;
            btn.style.background = "green";
          } else {
            btn.style.background = "red";
          }
          [...qDiv.querySelectorAll("button")].forEach(b => b.disabled = true);
          const exp = document.createElement("p");
          exp.textContent = "Explanation: " + item.explanation;
          exp.style.fontStyle = "italic";
          qDiv.appendChild(exp);
        };
        qDiv.appendChild(btn);
      });
      quizDiv.appendChild(qDiv);
    });

    const finishBtn = document.createElement("button");
    finishBtn.textContent = "Finish Module";
    finishBtn.onclick = () => {
      resultsDiv.innerHTML = `<h3>${moduleName} Results</h3>
        <p>You scored ${score} out of ${questions.length}</p>`;
      saveProgress(moduleName, score, questions.length);
      updateLeaderboard(moduleName, score, questions.length);
      renderDashboard();
    };
    quizDiv.appendChild(finishBtn);
  };

  // --- Progress Tracking ---
  function saveProgress(module, score, total) {
    let progress = JSON.parse(localStorage.getItem("satProgress")) || {};
    progress[module] = { score, total };
    localStorage.setItem("satProgress", JSON.stringify(progress));
  }

  function renderDashboard() {
    let progress = JSON.parse(localStorage.getItem("satProgress")) || {};
    dashboardDiv.innerHTML = "<h3>Progress Dashboard</h3>";
    for (let mod in progress) {
      let percent = Math.round((progress[mod].score / progress[mod].total) * 100);
      let bar = document.createElement("div");
      bar.classList.add("progress-bar");
      bar.innerHTML = `<strong>${mod}</strong>: ${progress[mod].score}/${progress[mod].total}
        <div class="bar"><div class="fill" style="width:${percent}%"></div></div>`;
      dashboardDiv.appendChild(bar);
    }
    renderLeaderboard();
  }

  // --- Leaderboard ---
  function updateLeaderboard(module, score, total) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ module, score, total, date: new Date().toLocaleDateString() });
    leaderboard.sort((a, b) => (b.score/b.total) - (a.score/a.total));
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  function renderLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const lbDiv = document.createElement("div");
    lbDiv.innerHTML = "<h3>Leaderboard</h3>";
    let list = document.createElement("ol");
    leaderboard.slice(0, 5).forEach(entry => {
      let li = document.createElement("li");
      let percent = Math.round((entry.score/entry.total)*100);
      li.textContent = `${entry.module}: ${entry.score}/${entry.total} (${percent}%) on ${entry.date}`;
      list.appendChild(li);
    });
    lbDiv.appendChild(list);
    dashboardDiv.appendChild(lbDiv);
  }

  renderDashboard(); // Show dashboard on load
});
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchScholarship");
  const filterSelect = document.getElementById("filterType");
  const scholarshipList = document.getElementById("scholarshipList");

  if (searchInput && filterSelect && scholarshipList) {
    function filterScholarships() {
      const searchText = searchInput.value.toLowerCase();
      const filterType = filterSelect.value;

      [...scholarshipList.querySelectorAll(".card")].forEach(card => {
        const matchesText = card.innerText.toLowerCase().includes(searchText);
        const matchesType = filterType === "all" || card.dataset.type === filterType;
        card.style.display = (matchesText && matchesType) ? "block" : "none";
      });
    }

    searchInput.addEventListener("input", filterScholarships);
    filterSelect.addEventListener("change", filterScholarships);
  }
});

