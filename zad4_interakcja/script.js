document.addEventListener("DOMContentLoaded", () => {
  const themeLink = document.getElementById("theme-link");
  const themeToggleButton = document.getElementById("theme-toggle");
  const sectionToggleButton = document.getElementById("section-toggle");
  const projectsSection = document.getElementById("projects-section");

  if (!themeLink || !themeToggleButton || !sectionToggleButton || !projectsSection) {
    return;
  }

  let currentTheme = "red";

  const updateThemeButton = () => {
    themeToggleButton.textContent = currentTheme === "red"
      ? "Przełącz na green"
      : "Przełącz na red";
  };

  const updateSectionButton = () => {
    const isHidden = projectsSection.hidden;
    sectionToggleButton.textContent = isHidden
      ? "Pokaż sekcję Projekty"
      : "Ukryj sekcję Projekty";
    sectionToggleButton.setAttribute("aria-expanded", String(!isHidden));
  };

  themeToggleButton.addEventListener("click", () => {
    currentTheme = currentTheme === "red" ? "green" : "red";
    themeLink.setAttribute("href", `${currentTheme}.css`);
    updateThemeButton();
  });

  sectionToggleButton.addEventListener("click", () => {
    projectsSection.hidden = !projectsSection.hidden;
    updateSectionButton();
  });

  updateThemeButton();
  updateSectionButton();
});
