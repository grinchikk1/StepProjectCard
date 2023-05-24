export default class Modal {
  constructor(
    addButtonId,
    containerId,
    closeButtonId,
    selectId,
    formId,
    fields
  ) {
    this.addButton = document.getElementById(addButtonId);
    this.container = document.getElementById(containerId);
    this.closeButton = document.getElementById(closeButtonId);
    this.select = document.getElementById(selectId);
    this.form = document.getElementById(formId);
    this.fields = fields;
    this.currentCardId = null;
    this.editMode = false;

    this.addButton.addEventListener("click", this.openModal.bind(this));
    this.closeButton.addEventListener("click", this.closeModal.bind(this));
    window.addEventListener("click", this.handleOutsideClick.bind(this));
    this.select.addEventListener("change", this.handleDoctorChange.bind(this));
  }

  openModal() {
    this.container.style.display = "block";
    const header = this.container.querySelector(".modal-header");
    const button = this.container.querySelector("#create");

    if (this.editMode) {
      header.textContent = "Редагувати візит";
      button.textContent = "Змінити";
    } else {
      header.textContent = "Створити візит";
      button.textContent = "Створити";
    }
    const inputs = this.form.getElementsByTagName("input");
    for (let input of inputs) {
      input.value = "";
    }
    const selectElements = this.form.getElementsByTagName("select");
    for (let select of selectElements) {
      select.selectedIndex = 0;
    }
  }

  closeModal() {
    this.container.style.display = "none";
    this.editMode = false;
  }

  handleOutsideClick(event) {
    if (event.target === this.container) {
      this.closeModal();
    }
  }

  handleDoctorChange() {
    const selectedDoctor = this.select.value;
    this.displayFields(selectedDoctor);
  }

  displayFields(doctorType) {
    this.form.innerHTML = "";

    if (doctorType !== "") {
      const selectStatus = document.createElement("select");
      selectStatus.id = "status";
      selectStatus.name = "статус";
      ["статус", "відкритий", "закритий"].forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        selectStatus.appendChild(optionElement);
      });
      this.form.appendChild(selectStatus);

      this.fields.common.forEach((field, index) => {
        const input = document.createElement("input");
        input.placeholder = field;
        this.form.appendChild(input);
      });

      const select = document.createElement("select");
      select.id = "urgency";
      select.name = "терміновість";
      ["терміновість", "звичайна", "приорітетна", "невідкладна"].forEach(
        (option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.text = option;
          select.appendChild(optionElement);
        }
      );
      this.form.appendChild(select);

      this.fields[doctorType].forEach((field) => {
        const input = document.createElement("input");
        input.placeholder = field;
        this.form.appendChild(input);
      });
    }
  }
}
