document.addEventListener("DOMContentLoaded", () => {
  const themeLink = document.getElementById("theme-link");
  const themeToggleButton = document.getElementById("theme-toggle");
  const sectionToggleButton = document.getElementById("section-toggle");
  const projectsSection = document.getElementById("projects-section");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const skillsList = document.getElementById("skills-list");
      data.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        skillsList.appendChild(li);
      });

      const projectsList = document.getElementById("projects-list");
      data.projects.forEach((project) => {
        const li = document.createElement("li");
        li.textContent = project;
        projectsList.appendChild(li);
      });
    })
    .catch((error) => console.error("Blad ladowania data.json:", error));

  if (themeLink && themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const newTheme = themeLink.getAttribute("href") === "red.css" ? "green.css" : "red.css";
      themeLink.setAttribute("href", newTheme);
    });
  }

  if (sectionToggleButton && projectsSection) {
    sectionToggleButton.addEventListener("click", () => {
      const isHidden = projectsSection.style.display === "none";
      projectsSection.style.display = isHidden ? "block" : "none";
      sectionToggleButton.textContent = isHidden ? "Ukryj sekcje Projekty" : "Pokaz sekcje Projekty";
    });
  }

  if (!contactForm || !formStatus) {
    return;
  }

  const fieldIds = ["first-name", "last-name", "email", "message"];

  const setError = (fieldId, message) => {
    const errorNode = document.getElementById(`${fieldId}-error`);
    if (errorNode) {
      errorNode.textContent = message;
    }
  };

  const clearErrors = () => {
    fieldIds.forEach((fieldId) => setError(fieldId, ""));
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const payload = {
      firstName: document.getElementById("first-name")?.value.trim() || "",
      lastName: document.getElementById("last-name")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      message: document.getElementById("message")?.value.trim() || ""
    };

    let isValid = true;

    if (!payload.firstName) {
      setError("first-name", "Imie jest wymagane.");
      isValid = false;
    }

    if (!payload.lastName) {
      setError("last-name", "Nazwisko jest wymagane.");
      isValid = false;
    }

    if (!payload.email) {
      setError("email", "E-mail jest wymagany.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        setError("email", "Podaj poprawny adres e-mail.");
        isValid = false;
      }
    }

    if (!payload.message) {
      setError("message", "Wiadomosc jest wymagana.");
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = "Popraw pola formularza i sprobuj ponownie.";
      formStatus.style.color = "#b22222";
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    formStatus.textContent = "Wysylanie...";
    formStatus.style.color = "#333";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Nie udalo sie wyslac formularza.");
      }

      formStatus.textContent = result.message || "Formularz zostal wyslany poprawnie.";
      formStatus.style.color = "#1a7f37";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = error.message || "Blad polaczenia z serwerem.";
      formStatus.style.color = "#b22222";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});