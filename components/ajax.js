// Token
const token = JSON.parse(localStorage.getItem("authToken"));
const url = "https://ajax.test-danit.com/api/v2/cards";

// функція отримання всіх карток
export async function getAllCards() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const cards = await response.json();
  return cards;
}

// функція отримання однієі картки!
export async function getOneCard(id) {
  const response = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const card = await response.json();
  return card;
}

// функція зміни даних картки
export async function updateCard(id, updatedData) {
  const response = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const card = await response.json();
  return card;
}

// функція видалення картки
export async function deleteCard(id) {
  await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// функція логін
export const login = async (email, password) => {
  const response = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.text());
  return response;
};

// функція відправки даних картки
export async function postData(data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
}
