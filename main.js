import Modal from "./components/modal.js";
import { getFormData, validationForm } from "./components/script.js";
import {
    getAllCards,
    login,
    getOneCard,
    deleteCard,
    updateCard,
    postData,
} from "./components/ajax.js";

const form = document.querySelector(".input-container");
const btn = document.querySelector("#btn-exit");
const authBtn = document.querySelector("#auth-btn");
const register = document.querySelector("#reg-btn");
const modalReg = document.querySelector(".wrapper");
const addVisit = document.querySelector("#addVisit");
const createBtn = document.querySelector("#create");
const searchBtn = document.querySelector("#search-btn");
let allCardsLocal = [];

btn.addEventListener("click", () => {
    modalReg.style.display = "block";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
});

authBtn.addEventListener("click", authenticateUser);

window.addEventListener("click", function (event) {
    if (event.target === modal.container) {
        modal.closeModal();
    }
});

register.addEventListener("click", async () => {
    const { value: email } = document.querySelector("#floatingInput");
    const { value: password } = document.querySelector("#floatingPassword");

    if (email && password) {
        const response = await login(email, password);
        localStorage.setItem("authToken", JSON.stringify(response));
        document.querySelector("#floatingInput").value = "";
        document.querySelector("#floatingPassword").value = "";
        modalReg.style.display = "none";
        btn.style.display = "none";
        addVisit.style.display = "block";
        alert("Успішна операція");
    } else {
        alert("Заповніть всі поля!");
    }
});

createBtn.addEventListener("click", posts);

// Create Modal
const modal = new Modal(
    "addVisit",
    "modalContainer",
    "closeModal",
    "doctorType",
    "form",
    {
        common: ["ціль візиту", "короткий опис візиту", "ПІБ"],
        cardiologist: [
            "звичайний тиск",
            "індекс маси тіла",
            "перенесені захворювання серцево-судинної системи",
            "вік",
        ],
        dentist: ["дата останнього візиту"],
        therapist: ["вік"],
    }
);

// функція створення і відправлення картки на сервер
async function posts() {
    try {
        const formData = getFormData(modal.form);
        formData["doctorType"] = modal.select.value;

        const errors = validationForm(formData);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        if (Object.keys(formData).length <= 3) {
            alert("Заповніть всі поля у формі");
            return;
        }

        if (modal.editMode) {
            const updatedCard = await updateCard(modal.currentCardId, formData);
            const index = allCardsLocal.findIndex(
                (card) => card.id === updatedCard.id
            );
            if (index !== -1) {
                allCardsLocal[index] = updatedCard;
                const filteredCards = filters(allCardsLocal);
                displayCards(filteredCards);
            }
        } else {
            const newCard = await postData(formData);
            allCardsLocal.push(newCard);
            const filteredCards = filters(allCardsLocal);
            displayCards(filteredCards);
        }
        modal.editMode = false;
        modal.closeModal();
    } catch (error) {
        console.error(error);
    }
}

// функція відображення карток
async function displayCards(cards) {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";
    if (cards.length === 0) {
        container.innerHTML =
            '<p id="no-items" class="text-information">No items have been added.</p>';
        return;
    }

    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML = `
  <div class="card-header">
    <button class="btn btn-danger btn-sm float-right btnDel" data-card-id="${card.id
            }">X</button>
    <h2 class="card-title">${card.doctorType}</h2>
  </div>
  <div class="card-body">
    <p>статус: ${card["статус"]}</p>
    <h2>${card["ПІБ"]}</h2>
    <p>Ціль візиту: ${card["ціль візиту"]}</p>
    <p>Короткий опис візиту: ${card["короткий опис візиту"]}</p>
    <div class="card-details hidden">
      ${card.doctorType === "cardiologist"
                ? `
        <p>Звичайний тиск: ${card["звичайний тиск"]}</p>
        <p>Індекс маси тіла: ${card["індекс маси тіла"]}</p>
        <p>Спадкові захворювання: ${card["перенесені захворювання серцево-судинної системи"]}</p>
        <p>Вік: ${card["вік"]}</p>
      `
                : ""
            }
      ${card.doctorType === "dentist"
                ? `
        <p>Дата останнього візиту: ${card["дата останнього візиту"]}</p>
      `
                : ""
            }
      ${card.doctorType === "therapist"
                ? `
        <p>Вік: ${card["вік"]}</p>
      `
                : ""
            }
    </div>
    <button class="btn btn-outline-dark btnMore" data-card-id="${card.id
            }">Показати більше</button>
    <button class="btn btn-outline-dark btnEdit" data-card-id="${card.id
            }">Редагувати</button>
  </div>
`;
        container.appendChild(cardElement);
    });

    const deleteButtons = document.querySelectorAll(".btnDel");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const cardId = button.dataset.cardId;
            await deleteCard(cardId);
            await displayCards(allCardsLocal);
            const index = allCardsLocal.findIndex(
                (card) => card.id === Number(cardId)
            );
            if (index !== -1) {
                allCardsLocal.splice(index, 1);
            }
            button.parentElement.remove();
            if (cards.length === 0) {
                container.innerHTML =
                    '<p id="no-items" class="text-information">No items have been added.</p>';
            }
        });
    });

    const moreButtons = document.querySelectorAll(".btnMore");
    moreButtons.forEach((button) => {
        if (!button.dataset.clickAdded) {
            button.addEventListener("click", (event) => {
                const cardBody = event.target.parentElement;
                const cardDetails = cardBody.querySelector(".card-details");
                cardDetails.classList.toggle("hidden");
                button.textContent = cardDetails.classList.contains("hidden")
                    ? "Показати більше"
                    : "Сховати";
            });
            button.dataset.clickAdded = true;
        }
    });

    const editButtons = document.querySelectorAll(".btnEdit");
    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const cardId = button.dataset.cardId;
            modal.currentCardId = cardId;
            const card = cards.find((c) => c.id === Number(cardId));
            modal.editMode = true;
            fillModal(card);
        });
    });

    function fillModal(card) {
        modal.editMode = true;
        modal.openModal();
        modal.select.value = card.doctorType;
        modal.displayFields(card.doctorType);

        const inputs = Array.from(modal.form.getElementsByTagName("input"));
        inputs.forEach((input, index) => {
            input.value = card[modal.fields.common[index]] || "";
        });

        const selectStatus = modal.form.querySelector("#status");
        selectStatus.value = card["статус"];

        const select = modal.form.querySelector("#urgency");
        select.value = card["терміновість"];

        if (modal.fields[card.doctorType]) {
            modal.fields[card.doctorType].forEach((field, index) => {
                inputs[modal.fields.common.length + index].value = card[field] || "";
            });
        }
    }
}

// функція авторизації
async function authenticateUser() {
    const savedToken = JSON.parse(localStorage.getItem("authToken"));
    if (savedToken) {
        modalReg.style.display = "none";
        btn.style.display = "none";
        addVisit.style.display = "block";
        const allCards = await getAllCards(); // отримати всі картки з сервера
        allCardsLocal = allCards;
        displayCards(allCards); // відобразити всі картки
        searchBtn.classList.remove("hidden");
    } else {
        alert("Ви не зареєстровані");
    }
}

// при завантаженні сторінки перевіряє наявність токену авторизації
// document.addEventListener("DOMContentLoaded", async () => {
//   await authenticateUser();
// });

// функція фільтрації
function filters(arr) {
    // обираємо select <статус>
    const statusField = Array.from(
        document.querySelectorAll("#input-select1 option")
    )
        .find((option) => option.selected)
        .textContent.toLowerCase();
    // обираємо select <терміновість>
    const urgencyField = document
        .querySelector("#input-select2")
        .value.toLowerCase();
    // обираємо input для пошуку
    const searchInput = document.getElementById("search-title");
    const searchValue = searchInput.value.trim().toLowerCase();

    if (statusField === "статус" && urgencyField === "терміновість") {
        return arr;
    }

    const filtered = arr.filter((item) => {
        if (
            item["терміновість"] === urgencyField &&
            item.doctorType.toLowerCase().startsWith(searchValue) &&
            item["статус"] === statusField
        ) {
            return item;
        }
    });
    return filtered;
}

// функція отримання, фільтрації карток та їх відображення
async function searchCards() {
    if (allCardsLocal.length > 0) {
        const filteredCards = filters(allCardsLocal);
        displayCards(filteredCards);
    }
}

// обробник подій на кнопку пошуку
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    searchCards();
});

searchBtn.classList.add("hidden");
