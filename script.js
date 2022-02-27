const textArea = document.querySelector(".thoughtInput");
const button = document.querySelector(".postButton");
const elementParent = document.querySelector(".thoughtsArea");
const errorParent = document.querySelector(".alertArea");

/* function whatsappApi() {
  console.log("redirecionar para whatsapp");
  const url = `https://wa.me/?text=${message}`;
  window.open((url = url), (target = "blank"));
} */
const localStorageThoughts = JSON.parse(localStorage.getItem("thoughts"));
let thoughts =
  localStorage.getItem("thoughts") !== null ? localStorageThoughts : [];

const updateLocalStorage = () => {
  localStorage.setItem("thoughts", JSON.stringify(thoughts));
};

function post() {
  try {
    validateText();
    newTought(textArea.value);
    updateScreen();
    clearTextArea();
    clearChildren(errorParent);
  } catch (error) {
    displayError(error.message);
  }
}

function updateScreen() {
  clearChildren(elementParent);
  thoughts.forEach((item, index) => {
    createThought(item, index);
  });
}

function newTought(thought) {
  thoughts.push(thought);
  updateLocalStorage();
}

function createThought(thought, index) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("mt-1");
  div.innerHTML = cardTemplate(thought, index);
  elementParent.prepend(div);
}

function archiveThought(message) {
  thoughts.unshift(message);
  console.log(thoughts);
}

function clearTextArea() {
  textArea.value = "";
}

function validateText() {
  const isEmpty = textArea.value === "";
  const lengthCount = textArea.value.trim().length;
  const isTooShort = lengthCount <= 3;

  if (isEmpty) {
    throw new Error("Can't post an empty card");
  } else if (isTooShort) {
    throw new Error(
      `Can't post cards with only ${lengthCount} characters. Please type 4 or more.`
    );
  }

  return;
}

function displayError(errorMessage) {
  clearChildren(errorParent);
  const errorTemplate = `${errorMessage}`;

  const div = document.createElement("div");
  div.classList.add("alert");
  div.classList.add("errorAlert");
  div.classList.add("alert-danger");
  div.innerHTML = errorTemplate;

  errorParent.prepend(div);
}

function clearChildren(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
}

function cardTemplate(text, index) {
  const template = `
    
        <div class="card-body">
        <div>
            <p class="card-text">
            ${text}
            </p>
            <i class="fa-brands fa-whatsapp fa-xl me-2" data-index=${index}></i>
            <i class="fa-brands fa-twitter fa-xl me-2" data-index=${index}></i>
            <i class="fa-brands fa-telegram fa-xl me-2" data-index=${index}></i>
            </div>
            <i class="closeButton fa-solid fa-xmark" data-index=${index}></i>
        </div>
    
    `;

  return template;
}

function removeItem(e) {
  const element = e.target;
  if (element.classList.contains("closeButton")) {
    const index = element.dataset.index;
    thoughts.splice(index, 1);
    updateLocalStorage();
    updateScreen();
  }
}

function redirectToSocialMedia(e) {
  const element = e.target;
  const index = element.dataset.index;

  const whatsapp = `https://wa.me/?text=${thoughts[index]}`;
  const twitter = `https://twitter.com/intent/tweet?text=${thoughts[index]}`;
  const telegram = `https://t.me/share/url?url=${thoughts[index]}`;

  let urlRedirect;

  if (element.classList.contains("fa-whatsapp")) {
    urlRedirect = whatsapp;
    window.open((url = urlRedirect), (target = "blank"));
  } else if (element.classList.contains("fa-twitter")) {
    urlRedirect = twitter;
    window.open((url = urlRedirect), (target = "blank"));
  } else if (element.classList.contains("fa-telegram")) {
    urlRedirect = telegram;
    window.open((url = urlRedirect), (target = "blank"));
  }
}

button.addEventListener("click", post);
textArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    post();
  }
});
elementParent.addEventListener("click", removeItem);
elementParent.addEventListener("click", redirectToSocialMedia);

updateScreen();
