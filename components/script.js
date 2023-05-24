// функція отримання данних з форми
export const getFormData = (form) =>
  [...form.elements].reduce((formData, field) => {
    if (field.value !== "") {
      switch (field.id) {
        case "urgency":
          formData["терміновість"] = field.value;
          break;
        case "status":
          formData["статус"] = field.value;
          break;
        default:
          formData[field.placeholder] = field.value;
          break;
      }
    }
    return formData;
  }, {});

// функція валідації форми
export function validationForm(formData) {
  const errors = [];

  if (formData.doctorType === "") {
    errors.push("Оберіть лікаря");
  }

  if (formData["статус"] === "статус") {
    errors.push("Оберіть статус!");
  }

  if (formData["терміновість"] === "терміновість") {
    errors.push("Оберіть терміновість!");
  }

  if (formData["звичайний тиск"]) {
    const bloodPressure = Number(formData["звичайний тиск"]);
    if (
      isNaN(bloodPressure) ||
      bloodPressure < 50 ||
      bloodPressure > 180 ||
      formData["звичайний тиск"].trim() === ""
    ) {
      errors.push("Звичайний тиск має знаходитись в межах від 50 до 180");
    }
  }

  if (formData["ПІБ"]) {
    const fullName = String(formData["ПІБ"]);
    if (
      typeof fullName !== "string" ||
      fullName.length < 3 ||
      fullName.trim() === ""
    ) {
      errors.push("Введіть коректні дані");
    }
  }

  if (formData["ціль візиту"]) {
    const goal = String(formData["ціль візиту"]);
    if (typeof goal !== "string" || goal.length < 5 || goal.trim() === "") {
      errors.push("Введіть коректні дані");
    }
  }

  if (formData["короткий опис візиту"]) {
    const shortDescription = String(formData["короткий опис візиту"]);
    if (
      typeof shortDescription !== "string" ||
      shortDescription.length < 5 ||
      shortDescription.trim() === ""
    ) {
      errors.push("Введіть короткий опис візуту");
    }
  }

  if (formData["індекс маси тіла"]) {
    const massIndex = Number(formData["індекс маси тіла"]);
    if (isNaN(massIndex) || formData["індекс маси тіла"].trim() === "") {
      errors.push("Введіть дані індексу маси тіла");
    }
  }

  if (formData["перенесені захворювання серцево-судинної системи"]) {
    const heartDiseases = String(
      formData["перенесені захворювання серцево-судинної системи"]
    );
    if (
      typeof heartDiseases !== "string" ||
      heartDiseases.length < 5 ||
      heartDiseases.trim() === ""
    ) {
      errors.push(
        "Введіть інформацію про перенесені захворювання серцево-судинної системи"
      );
    }
  }

  if (formData["вік"]) {
    const age = Number(formData["вік"]);
    if (isNaN(age) || formData["вік"].trim() === "") {
      errors.push("Невірно вказано вік");
    }
  }

  if (formData["дата останнього візиту"]) {
    const lastVisitData = Number(formData["дата останнього візиту"]);
    if (
      isNaN(lastVisitData) ||
      lastVisitData < 6 ||
      formData["дата останнього візиту"].trim() === ""
    ) {
      errors.push("Введіть дату останнього візиту");
    }
  }

  return errors;
}
