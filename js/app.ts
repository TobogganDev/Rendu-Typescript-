import Category from "./Category.js";
import Task from "./Task.js";
import LocalStorage from "./LocalStorage.js";

// Créer une instance de LocalStorage pour gérer les tâches
const localStorageService = new LocalStorage("tasks");

// ON PAGE LOAD RÉCUPÉRER TOUTES LES TACHES DANS LE LOCALSTORAGE

// Fonction pour afficher une tâche
function renderTask(task: Task) {
    const taskList = document.getElementById("tasks");

    // Créer tout les élements
    const taskDiv = document.createElement("div");
    taskDiv.id = `task-${task.id}`;
    taskDiv.classList.add("task", task.priority.toLocaleLowerCase());
    
    const taskTitle = document.createElement("h3");
    taskTitle.innerHTML = `${task.title} <span>– Priorité ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>`;
    const taskDate = document.createElement("p");
    taskDate.textContent = `Date d'échéance: ${task.date}`;
    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    const taskCategory = document.createElement("p");
    taskCategory.textContent = `Catégorie: ${task.category.name}`;
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
        deleteTask(task.id); // Call deleteTask function when the delete button is clicked
    });
    
    const editButton = document.createElement("button");
    editButton.textContent = "Modifier";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => {
        editTask(task.id); // Call editTask function when the edit button is clicked
    });
    
    // Ajouter les élements au div de la tâche
    taskDiv.appendChild(taskTitle);
    taskDiv.appendChild(taskDate);
    taskDiv.appendChild(taskDescription);
    taskDiv.appendChild(taskCategory);
    taskDiv.appendChild(deleteButton);
    taskDiv.appendChild(editButton);
    
    taskList?.appendChild(taskDiv);
}

// Récupérer les tâches du local storage et les afficher
function renderTasksFromLocalStorage() {
    // Récupérer les tâches du local storage
    const tasksFromLocalStorage = localStorageService.getAllTasks();
    const taskList = document.getElementById("tasks");
    
    if (tasksFromLocalStorage.length === 0) {
        // Si il n'y a pas de tâches à afficher, afficher un message
        const message = document.createElement("p");
        message.textContent = "Aucune tâche à afficher pour le moment.";
        taskList?.appendChild(message);
    } else {
        // Afficher les tâches
        tasksFromLocalStorage.forEach(task => renderTask(task));
    }
    
}

// Au chargement de la page, afficher les tâches du local storage
window.addEventListener("load", () => {
    renderTasksFromLocalStorage();
});


// CAPTER L'ÉVÉNEMENT AJOUTER UNE TACHE

function createTaskFromForm() {    
    // Récupérer les valeurs du formulaire
    const taskTitleInput = document.getElementById("taskTitle") as HTMLInputElement;
    const taskDescriptionInput = document.getElementById("taskDescription") as HTMLInputElement;
    const taskDueDateInput = document.getElementById("taskDueDate") as HTMLInputElement;
    const taskPriorityInput = document.getElementById("taskPriority") as HTMLSelectElement;
    const taskCategoryInput = document.getElementById("taskCategory") as HTMLInputElement;
    
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const date = taskDueDateInput.value;
    const taskCategory = taskCategoryInput.value;
    const category = new Category(taskCategory);
    const priority = taskPriorityInput.value;
    
    
    // Créer un nouvel objet Task
    const newTask = new Task(title, description, date, priority, category, localStorageService);
    
    // Ajouter la tâche au local storage
    newTask.createTask();
    
    // Videz les champs du formulaire
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDateInput.value = "";
    taskPriorityInput.value = "medium";
    taskCategoryInput.value = "";
}

const taskForm = document.getElementById("taskForm");
taskForm?.addEventListener("submit", createTaskFromForm);

// CAPTER L'ÉVENEMENT JE MODIFIE UNE TACHE

function editTask(taskId: number) {
    // Récupérer la tâche à modifier en utilisant l'ID de la tâche
    const task = localStorageService.getTaskById(taskId);
    if (!task) {
        console.error("Aucune tâche trouvée avec l'ID fourni.");
        return;
    }
    
    // Pré-remplir le formulaire de modification avec les détails de la tâche
    const editTaskTitleInput = document.getElementById("editTaskTitle") as HTMLInputElement;
    const editTaskDescriptionInput = document.getElementById("editTaskDescription") as HTMLTextAreaElement;
    const editTaskDueDateInput = document.getElementById("editTaskDueDate") as HTMLInputElement;
    const editTaskPriorityInput = document.getElementById("editTaskPriority") as HTMLSelectElement;
    const editTaskCategoryInput = document.getElementById("editTaskCategory") as HTMLInputElement;
    
    editTaskTitleInput.value = task.title;
    editTaskDescriptionInput.value = task.description;
    editTaskDueDateInput.value = task.date;
    editTaskPriorityInput.value = task.priority;
    editTaskCategoryInput.value = task.category.name;
    
    // Afficher le modal de modification
    const modal = document.getElementById("editTaskModal")!;
    modal.style.display = "block";
    
    // Mettre à jour la tâche dans le local storage lors de la soumission du formulaire
    const editTaskForm = document.getElementById("editTaskForm")!;
    editTaskForm.addEventListener("submit", () => {
        
        // Créer un nouvel objet Task avec les valeurs mises à jour
        const updatedTask = new Task(
            editTaskTitleInput.value,
            editTaskDescriptionInput.value,
            editTaskDueDateInput.value, 
            editTaskPriorityInput.value, 
            new Category(editTaskCategoryInput.value),
            localStorageService
        );
        updatedTask.id = task.id; // Préserver l'ID de la tâche
        
        // Mettre à jour la tâche dans le local storage
        localStorageService.updateTask(updatedTask);
        
        // Fermer le modal
        modal.style.display = "none";
    });
}


const closeEditTaskModalButton = document.querySelector(".close");
closeEditTaskModalButton?.addEventListener("click", () => {
    const modal = document.getElementById("editTaskModal")!;
    modal.style.display = "none";
});


// CAPTER L'ÉVÉNEMENT JE SUPPRIME UNE TACHE

function deleteTask(taskId: number) {
    // Retirer la tâche du DOM
    const taskElement = document.getElementById(`task-${taskId}`);
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
    const filterPriorityInput = document.getElementById("filterPriority") as HTMLSelectElement;
    const filterDateInput = document.getElementById("filterDate") as HTMLInputElement;
    
    const priorityFilter = filterPriorityInput.value;
    const dateFilter = filterDateInput.value;
    
    // Récupérer toutes les tâches du local storage
    const tasks = localStorageService.getAllTasks();
    
    // Appliquer le filtre de priorité
    let filteredTasks = priorityFilter !== 'all' ? tasks.filter(task => task.priority === priorityFilter) : tasks;
    
    // Appliquer le filtre de date
    filteredTasks = dateFilter ? filteredTasks.filter(task => task.date === dateFilter) : filteredTasks;
    
    // Mettre à jour le DOM avec les tâches filtrées
    displayTasks(filteredTasks);
}

function displayTasks(tasks: Task[]) {
    const taskListContainer = document.getElementById("tasks")!;
    taskListContainer.innerHTML = ""; // Clear existing tasks
    
    if (tasks.length === 0) {
        taskListContainer.innerHTML = "<p>Aucune tâche</p>";
        return;
    }
    
    // Afficher les tâches
    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.id = `task-${task.id}`;
        taskDiv.classList.add("task", task.priority.toLowerCase());
        
        const taskTitle = document.createElement("h3");
        taskTitle.innerHTML = `${task.title} <span>– Priorité ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>`;
        
        const taskDate = document.createElement("p");
        taskDate.textContent = `Date d'échéance: ${task.date}`;
        
        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        
        const taskCategory = document.createElement("p");
        taskCategory.textContent = `Catégorie: ${task.category.name}`;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });
        
        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", () => {
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

const applyFilterButton = document.getElementById("applyFilter")!;
applyFilterButton.addEventListener("click", applyFilters);

// JE FAIS UNE RECHERCHE
// Fonction pour rechercher des tâches
function searchTasks(keyword: string) {
    // Récupérer toutes les tâches du local storage
    const tasks = localStorageService.getAllTasks();
    
    // Filtrer les tâches en fonction du mot-clé de recherche
    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(keyword.toLowerCase()) || 
        task.description.toLowerCase().includes(keyword.toLowerCase());
    });
    
    // Mettre à jour le DOM avec les tâches filtrées
    displayTasks(filteredTasks);
}

const searchButton = document.getElementById("searchButton")!;
searchButton.addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const keyword = searchInput.value.trim();
    searchTasks(keyword);
});