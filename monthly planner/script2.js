// Référence aux éléments
const openPopupBtn = document.getElementById("openPopupBtn");
const closePopupBtn = document.getElementById("closePopupBtn");
const popup = document.getElementById("popup");

// Référence aux éléments du tableau pour afficher les objectifs personnels
const personalBox = document.getElementById("personalBox");
const viewPopup = document.getElementById("viewGoalsPopup");
const closeViewPopupBtn = document.getElementById("closeViewPopupBtn");
const goalsList = document.getElementById("goalsList");

// Tableau pour stocker les objectifs
let personalGoals = [];

// Ouvrir la popup pour ajouter un objectif personnel
openPopupBtn.addEventListener("click", function () {
  popup.style.display = "flex";
});

// Fermer la popup d'ajout d'objectif personnel
closePopupBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

// Fermer la popup si on clique en dehors de celle-ci
window.addEventListener("click", function (e) {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

// Ajouter un objectif personnel
document
  .getElementById("personalGoalForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("goalTitle").value;
    const date = document.getElementById("goalDate").value;
    const category = document.getElementById("goalCategory").value;
    const description = document.getElementById("goalDescription").value;
    const priority = document.getElementById("goalPriority").value;
    const status = document.getElementById("goalStatus").value;

    personalGoals.push({
      title,
      date,
      category,
      description,
      priority,
      status,
    });

    popup.style.display = "none";
    this.reset();
    updateGoalList();
  });

// Afficher les objectifs personnels dans une popup
personalBox.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn")) return;
  updateGoalList();
  viewPopup.style.display = "flex";
});

// Fermer la popup pour afficher les objectifs personnels
closeViewPopupBtn.addEventListener("click", function () {
  viewPopup.style.display = "none";
});

// Modifier ou supprimer un objectif
goalsList.addEventListener("click", function (e) {
  const index = e.target.getAttribute("data-index");

  if (e.target.classList.contains("modify-btn")) {
    const goal = personalGoals[index];
    goal.status = goal.status === "in-progress" ? "completed" : "in-progress";
    updateGoalList();
  }

  if (e.target.classList.contains("delete-btn")) {
    personalGoals.splice(index, 1);
    updateGoalList();
  }
});

// Fonction pour mettre à jour la liste des objectifs
function updateGoalList() {
  goalsList.innerHTML = "";

  if (personalGoals.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun objectif pour le moment.";
    goalsList.appendChild(li);
    return;
  }

  personalGoals.forEach((goal, index) => {
    const li = document.createElement("li");
    li.style.listStyleType = "disc";
    li.style.marginBottom = "10px";
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.alignItems = "flex-start";

    const contentDiv = document.createElement("div");
    contentDiv.style.display = "flex";
    contentDiv.style.gap = "15px";
    contentDiv.style.flexWrap = "wrap";
    contentDiv.style.marginBottom = "5px";

    const title = document.createElement("span");
    title.textContent = goal.title;

    const date = document.createElement("span");
    date.textContent = goal.date || "—";

    const category = document.createElement("span");
    category.textContent = goal.category;

    const status = document.createElement("span");
    status.textContent = goal.status;

    const priority = document.createElement("span");
    priority.textContent = goal.priority;

    contentDiv.appendChild(title);
    contentDiv.appendChild(date);
    contentDiv.appendChild(category);
    contentDiv.appendChild(status);
    contentDiv.appendChild(priority);

    const btnDiv = document.createElement("div");
    btnDiv.style.display = "flex";
    btnDiv.style.gap = "10px";

    const modifyBtn = document.createElement("button");
    modifyBtn.className = "modify-btn";
    modifyBtn.textContent = "Update";
    modifyBtn.setAttribute("data-index", index);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-index", index);

    btnDiv.appendChild(modifyBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(btnDiv);

    goalsList.appendChild(li);
  });
}
