import Category from "./Category.js";
import Task from "./Task.js";
import LocalStorage from "./LocalStorage.js";
// Créer une instance de LocalStorage pour gérer les tâches
var localStorageService = new LocalStorage("tasks");
// ON PAGE LOAD RÉCUPÉRER TOUTES LES TACHES DANS LE LOCALSTORAGE
// Fonction pour afficher une tâche
function renderTask(task) {
    var taskList = document.getElementById("tasks");
    // Créer tout les élements
    var taskDiv = document.createElement("div");
    taskDiv.id = "task-".concat(task.id);
    taskDiv.classList.add("task", task.priority.toLocaleLowerCase());
    var taskTitle = document.createElement("h3");
    taskTitle.innerHTML = "".concat(task.title, " <span>\u2013 Priorit\u00E9 ").concat(task.priority.charAt(0).toUpperCase() + task.priority.slice(1), "</span>");
    var taskDate = document.createElement("p");
    taskDate.textContent = "Date d'\u00E9ch\u00E9ance: ".concat(task.date);
    var taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    var taskCategory = document.createElement("p");
    taskCategory.textContent = "Cat\u00E9gorie: ".concat(task.category.name);
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
        deleteTask(task.id); // Call deleteTask function when the delete button is clicked
    });
    var editButton = document.createElement("button");
    editButton.textContent = "Modifier";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", function () {
        editTask(task.id); // Call editTask function when the edit button is clicked
    });
    // Ajouter les élements au div de la tâche
    taskDiv.appendChild(taskTitle);
    taskDiv.appendChild(taskDate);
    taskDiv.appendChild(taskDescription);
    taskDiv.appendChild(taskCategory);
    taskDiv.appendChild(deleteButton);
    taskDiv.appendChild(editButton);
    taskList === null || taskList === void 0 ? void 0 : taskList.appendChild(taskDiv);
}
// Récupérer les tâches du local storage et les afficher
function renderTasksFromLocalStorage() {
    // Récupérer les tâches du local storage
    var tasksFromLocalStorage = localStorageService.getAllTasks();
    var taskList = document.getElementById("tasks");
    if (tasksFromLocalStorage.length === 0) {
        // Si il n'y a pas de tâches à afficher, afficher un message
        var message = document.createElement("p");
        message.textContent = "Aucune tâche à afficher pour le moment.";
        taskList === null || taskList === void 0 ? void 0 : taskList.appendChild(message);
    }
    else {
        // Afficher les tâches
        tasksFromLocalStorage.forEach(function (task) { return renderTask(task); });
    }
}
// Au chargement de la page, afficher les tâches du local storage
window.addEventListener("load", function () {
    renderTasksFromLocalStorage();
});
// CAPTER L'ÉVÉNEMENT AJOUTER UNE TACHE
function createTaskFromForm() {
    // Récupérer les valeurs du formulaire
    var taskTitleInput = document.getElementById("taskTitle");
    var taskDescriptionInput = document.getElementById("taskDescription");
    var taskDueDateInput = document.getElementById("taskDueDate");
    var taskPriorityInput = document.getElementById("taskPriority");
    var taskCategoryInput = document.getElementById("taskCategory");
    var title = taskTitleInput.value;
    var description = taskDescriptionInput.value;
    var date = taskDueDateInput.value;
    var taskCategory = taskCategoryInput.value;
    var category = new Category(taskCategory);
    var priority = taskPriorityInput.value;
    // Créer un nouvel objet Task
    var newTask = new Task(title, description, date, priority, category, localStorageService);
    // Ajouter la tâche au local storage
    newTask.createTask();
    // Videz les champs du formulaire
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDateInput.value = "";
    taskPriorityInput.value = "medium";
    taskCategoryInput.value = "";
}
var taskForm = document.getElementById("taskForm");
taskForm === null || taskForm === void 0 ? void 0 : taskForm.addEventListener("submit", createTaskFromForm);
// CAPTER L'ÉVENEMENT JE MODIFIE UNE TACHE
function editTask(taskId) {
    // Récupérer la tâche à modifier en utilisant l'ID de la tâche
    var task = localStorageService.getTaskById(taskId);
    if (!task) {
        console.error("Aucune tâche trouvée avec l'ID fourni.");
        return;
    }
    // Pré-remplir le formulaire de modification avec les détails de la tâche
    var editTaskTitleInput = document.getElementById("editTaskTitle");
    var editTaskDescriptionInput = document.getElementById("editTaskDescription");
    var editTaskDueDateInput = document.getElementById("editTaskDueDate");
    var editTaskPriorityInput = document.getElementById("editTaskPriority");
    var editTaskCategoryInput = document.getElementById("editTaskCategory");
    editTaskTitleInput.value = task.title;
    editTaskDescriptionInput.value = task.description;
    editTaskDueDateInput.value = task.date;
    editTaskPriorityInput.value = task.priority;
    editTaskCategoryInput.value = task.category.name;
    // Afficher le modal de modification
    var modal = document.getElementById("editTaskModal");
    modal.style.display = "block";
    // Mettre à jour la tâche dans le local storage lors de la soumission du formulaire
    var editTaskForm = document.getElementById("editTaskForm");
    editTaskForm.addEventListener("submit", function () {
        // Créer un nouvel objet Task avec les valeurs mises à jour
        var updatedTask = new Task(editTaskTitleInput.value, editTaskDescriptionInput.value, editTaskDueDateInput.value, editTaskPriorityInput.value, new Category(editTaskCategoryInput.value), localStorageService);
        updatedTask.id = task.id; // Préserver l'ID de la tâche
        // Mettre à jour la tâche dans le local storage
        localStorageService.updateTask(updatedTask);
        // Fermer le modal
        modal.style.display = "none";
    });
}
var closeEditTaskModalButton = document.querySelector(".close");
closeEditTaskModalButton === null || closeEditTaskModalButton === void 0 ? void 0 : closeEditTaskModalButton.addEventListener("click", function () {
    var modal = document.getElementById("editTaskModal");
    modal.style.display = "none";
});
// CAPTER L'ÉVÉNEMENT JE SUPPRIME UNE TACHE
function deleteTask(taskId) {
    // Retirer la tâche du DOM
    var taskElement = document.getElementById("task-".concat(taskId));
    if (taskElement) {
        taskElement.remove();
    }
    // Supprimer la tâche du local storage
    localStorageService.deleteTask(taskId);
}
// J'APPLIQUE UN FILTRE
// Fonction pour appliquer les filtres
function applyFilters() {
    // Récupérer les valeurs des filtres
    var filterPriorityInput = document.getElementById("filterPriority");
    var filterDateInput = document.getElementById("filterDate");
    var priorityFilter = filterPriorityInput.value;
    var dateFilter = filterDateInput.value;
    // Récupérer toutes les tâches du local storage
    var tasks = localStorageService.getAllTasks();
    // Appliquer le filtre de priorité
    var filteredTasks = priorityFilter !== 'all' ? tasks.filter(function (task) { return task.priority === priorityFilter; }) : tasks;
    // Appliquer le filtre de date
    filteredTasks = dateFilter ? filteredTasks.filter(function (task) { return task.date === dateFilter; }) : filteredTasks;
    // Mettre à jour le DOM avec les tâches filtrées
    displayTasks(filteredTasks);
}
function displayTasks(tasks) {
    var taskListContainer = document.getElementById("tasks");
    taskListContainer.innerHTML = ""; // Clear existing tasks
    if (tasks.length === 0) {
        taskListContainer.innerHTML = "<p>Aucune tâche</p>";
        return;
    }
    // Afficher les tâches
    tasks.forEach(function (task) {
        var taskDiv = document.createElement("div");
        taskDiv.id = "task-".concat(task.id);
        taskDiv.classList.add("task", task.priority.toLowerCase());
        var taskTitle = document.createElement("h3");
        taskTitle.innerHTML = "".concat(task.title, " <span>\u2013 Priorit\u00E9 ").concat(task.priority.charAt(0).toUpperCase() + task.priority.slice(1), "</span>");
        var taskDate = document.createElement("p");
        taskDate.textContent = "Date d'\u00E9ch\u00E9ance: ".concat(task.date);
        var taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        var taskCategory = document.createElement("p");
        taskCategory.textContent = "Cat\u00E9gorie: ".concat(task.category.name);
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });
        var editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", function () {
            editTask(task.id);
        });
        taskDiv.appendChild(taskTitle);
        taskDiv.appendChild(taskDate);
        taskDiv.appendChild(taskDescription);
        taskDiv.appendChild(taskCategory);
        taskDiv.appendChild(deleteButton);
        taskDiv.appendChild(editButton);
        taskListContainer.appendChild(taskDiv);
    });
}
var applyFilterButton = document.getElementById("applyFilter");
applyFilterButton.addEventListener("click", applyFilters);
// JE FAIS UNE RECHERCHE
// Fonction pour rechercher des tâches
function searchTasks(keyword) {
    // Récupérer toutes les tâches du local storage
    var tasks = localStorageService.getAllTasks();
    // Filtrer les tâches en fonction du mot-clé de recherche
    var filteredTasks = tasks.filter(function (task) {
        return task.title.toLowerCase().includes(keyword.toLowerCase()) ||
            task.description.toLowerCase().includes(keyword.toLowerCase());
    });
    // Mettre à jour le DOM avec les tâches filtrées
    displayTasks(filteredTasks);
}
var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
    var searchInput = document.getElementById("searchInput");
    var keyword = searchInput.value.trim();
    searchTasks(keyword);
});
