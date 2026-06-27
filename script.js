let form =  document.querySelector("form");
let taskContainer = document.querySelector(".task-container");
let input = document.querySelector(".input-title");
let select = document.querySelector(".category");
let theme = document.querySelector(".nav-right");
let body = document.body;
let themeIcon = document.querySelector(".nav-right i");

let total = document.querySelector(".total");
let complete = document.querySelector(".completed");
let pending = document.querySelector(".pending");

let task = [];

let editId = null;

theme.addEventListener("click", () => {
    let currentTheme = body.dataset.theme

    if (currentTheme === "light") {
        body.dataset.theme = "dark"
        themeIcon.className = "ri-sun-fill";
    } else {
        body.dataset.theme = "light"; 
        themeIcon.className = "ri-moon-fill"
    }

    localStorage.setItem("theme", body.dataset.theme)
});

function loadTheme() {
    let saved = localStorage.getItem("theme")
    if (saved) {
    body.dataset.theme = saved;

    if (saved === "dark") {
      themeIcon.classList = "ri-sun-fill";
    } else {
      themeIcon.className = "ri-moon-fill";
    }
  }
}

function renderTask() {
    taskContainer.innerHTML = "";

    task.forEach((dets, index) => {
        taskContainer.innerHTML += `<div class="task-card" data-id='${dets.id}' data-status='${dets.status}' data-categiry='${dets.category}'>
        <div class="task-top">
            <h2>${dets.title}</h2>
            <span class="badge">${dets.category}</span>
        </div>

        <p class="status">${dets.status}</p>

        <div class="btns">
            <button class="edit"><span><i class="ri-edit-line"></i></span>Edit</button>
            <button class="complete"><span><i class="ri-check-line"></i></span>Complete</button>
            <button class="delete"><span><i class="ri-delete-bin-line"></i></span>Delete</button>
        </div>
    </div>`
    })
}

function saveTasksLS() {
    localStorage.setItem("savedTask", JSON.stringify(task))
}
function loadTaskLS(){
    let saved = localStorage.getItem("savedTask")

    if(saved) {
        task = JSON.parse(saved)
    }
    renderTask()
}
function updateCounter(){
    let totalTask = task.length;
    let completeTask = task.filter((i) => i.status === "Completed").length;
    let PendingTask = task.filter((i) => i.status === "Pending").length;
    
    total.textContent = totalTask;
    complete.textContent = completeTask;
    pending.textContent = pendingTask;
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    let title = event.target[0].value
    let category = event.target[1].value
     if (title.trim() === "" || category.trim() === "") {
    alert("Please File All Field");
    return;
  }

  let newTask = {
    id: Date.now(),
    title,
    category,
    status: "Pending",
  };

  let currentTask = task.find((i) => i.id === editId);

  if (editId !== null) {
    currentTask.title = title;
    currentTask.category = category;
    saveTasksLS();
    updateCounter();
    editId = null;
  } else {
    task.push(newTask);
    saveTasksLS();
    updateCounter();
  }

  saveTasksLS();
  renderTask();

  form.reset();
});

taskContainer.addEventListener("click", (dets) => {
  let completeBtn = dets.target.closest(".complete");

  if (completeBtn) {
    let card = dets.target.closest(".task-card");
    let id = Number(card.dataset.id);

    let currentTask = task.find((i) => i.id === id);

    if (currentTask) {
      if (currentTask.status === "Pending") {
        currentTask.status = "Completed";
      } else {
        currentTask.status = "Pending";
      }
      saveTasksLS();
      updateCounter();
    }

    renderTask();
  }

  let deleteBtn = dets.target.closest(".delete");

  if (deleteBtn) {
    let card = dets.target.closest(".task-card");
    let id = Number(card.dataset.id);

    let index = task.findIndex((i) => i.id === id);

    if (index !== -1) {
      task.splice(index, 1);
      saveTasksLS();
      updateCounter();
      renderTask();
    }
  }

  let editBtn = dets.target.closest(".edit");

  if (editBtn) {
    let card = dets.target.closest(".task-card");
    let id = Number(card.dataset.id);

    editId = id;
    let currentTask = task.find((i) => i.id === id);

    input.value = currentTask.title;
    select.value = currentTask.category;
  }
});

loadTheme();
loadTaskLS();
updateCounter();



