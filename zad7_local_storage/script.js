document.addEventListener("DOMContentLoaded", () => {
  const themeLink = document.getElementById("theme-link");
  const themeToggleButton = document.getElementById("theme-toggle");
  const sectionToggleButton = document.getElementById("section-toggle");
  const projectsSection = document.getElementById("projects-section");
  const contactForm = document.getElementById("contact-form");

  fetch('data.json')
  .then(response => response.json())
  .then(data => {

    const skillsList = document.getElementById('skills-list');

    data.skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
    });

    const projectsList = document.getElementById('projects-list');

    data.projects.forEach(project => {
      const li = document.createElement('li');
      li.textContent = project;
      projectsList.appendChild(li);
    });

  })
  .catch(error => console.error('Błąd:', error));

  if (themeLink && themeToggleButton) {
    let currentTheme = "red";

    const updateThemeButton = () => {
      themeToggleButton.textContent = currentTheme === "red"
        ? "Przełącz na green"
        : "Przełącz na red";
    };

    themeToggleButton.addEventListener("click", () => {
      currentTheme = currentTheme === "red" ? "green" : "red";
      themeLink.setAttribute("href", `${currentTheme}.css`);
      updateThemeButton();
    });

    updateThemeButton();
  }

  if (sectionToggleButton && projectsSection) {
    const updateSectionButton = () => {
      const isHidden = projectsSection.hidden;
      sectionToggleButton.textContent = isHidden
        ? "Pokaż sekcję Projekty"
        : "Ukryj sekcję Projekty";
      sectionToggleButton.setAttribute("aria-expanded", String(!isHidden));
    };

    sectionToggleButton.addEventListener("click", () => {
      projectsSection.hidden = !projectsSection.hidden;
      updateSectionButton();
    });

    updateSectionButton();
  }

  if (contactForm instanceof HTMLFormElement) {
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formStatus = document.getElementById("form-status");

    const fields = [firstNameInput, lastNameInput, emailInput, messageInput];

    if (fields.every((field) => field instanceof HTMLElement) && formStatus) {
      const namePattern = /\d/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const setError = (field, message) => {
        const errorElement = document.getElementById(`${field.id}-error`);
        field.setAttribute("aria-invalid", "true");

        if (errorElement) {
          errorElement.textContent = message;
        }
      };

      const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}-error`);
        field.setAttribute("aria-invalid", "false");

        if (errorElement) {
          errorElement.textContent = "";
        }
      };

      const setStatus = (message, isSuccess) => {
        formStatus.textContent = message;
        formStatus.classList.toggle("success", isSuccess);
        formStatus.classList.toggle("error", !isSuccess);
      };

      const validateRequiredField = (field, message) => {
        if (!field.value.trim()) {
          setError(field, message);
          return false;
        }

        clearError(field);
        return true;
      };

      const validateNameField = (field, emptyMessage) => {
        if (!validateRequiredField(field, emptyMessage)) {
          return false;
        }

        if (namePattern.test(field.value)) {
          setError(field, "To pole nie może zawierać cyfr.");
          return false;
        }

        clearError(field);
        return true;
      };

      const validateEmailField = () => {
        if (!validateRequiredField(emailInput, "Podaj adres e-mail.")) {
          return false;
        }

        if (!emailPattern.test(emailInput.value.trim())) {
          setError(emailInput, "Podaj poprawny adres e-mail, np. jan.kowalski@example.com.");
          return false;
        }

        clearError(emailInput);
        return true;
      };

      const validateMessageField = () => validateRequiredField(messageInput, "Wpisz wiadomość.");

      const validateForm = () => {
        const isFirstNameValid = validateNameField(firstNameInput, "Podaj imię.");
        const isLastNameValid = validateNameField(lastNameInput, "Podaj nazwisko.");
        const isEmailValid = validateEmailField();
        const isMessageValid = validateMessageField();

        return isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid;
      };

      firstNameInput.addEventListener("input", () => validateNameField(firstNameInput, "Podaj imię."));
      lastNameInput.addEventListener("input", () => validateNameField(lastNameInput, "Podaj nazwisko."));
      emailInput.addEventListener("input", validateEmailField);
      messageInput.addEventListener("input", validateMessageField);

      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm()) {
          setStatus("Formularz zawiera błędy. Popraw pola oznaczone komunikatami.", false);
          return;
        }

        setStatus("Formularz został poprawnie zweryfikowany. Dane nie są wysyłane na serwer.", true);
        contactForm.reset();
        [firstNameInput, lastNameInput, emailInput, messageInput].forEach(clearError);
      });
    }
  }

const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');

let savedItems = JSON.parse(localStorage.getItem('myLocalData')) || [];

function renderList() {
    itemList.innerHTML = ''; 

    savedItems.forEach((text, index) => {
        const li = document.createElement('li');
        li.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = () => removeItem(index);

        li.appendChild(deleteBtn);
        itemList.appendChild(li);
    });
}

function addItem() {
    const value = itemInput.value.trim();
    
    if (value) {
        savedItems.push(value); 
        updateLocalStorage();  
        itemInput.value = '';  
    }
}

function removeItem(index) {
    savedItems.splice(index, 1); 
    updateLocalStorage();       
}

function updateLocalStorage() {

    localStorage.setItem('myLocalData', JSON.stringify(savedItems));
    renderList();
}

addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});
renderList();
});

