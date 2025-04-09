document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    question.addEventListener("click", () => {
      const isOpen = answer.classList.contains("show");

      // Ferme toutes les autres
      faqItems.forEach((i) => {
        i.querySelector(".faq-answer").classList.remove("show");
        i.querySelector(".faq-icon").textContent = "+";
      });

      // Ouvre ou ferme la sélectionnée
      if (!isOpen) {
        answer.classList.add("show");
        icon.textContent = "x";
      } else {
        answer.classList.remove("show");
        icon.textContent = "+";
      }
    });
  });
});
