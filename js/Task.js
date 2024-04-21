var Task = /** @class */ (function () {
    function Task(title, description, date, priority, category, localStorage) {
        this.id = Math.floor(Math.random() * 1000000) + 1;
        ;
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.category = category;
        this.localStorage = localStorage;
    }
    Task.prototype.createTask = function () {
        // Save the task to local storage
        this.localStorage.createTask(this);
        console.log("Task created:", this);
    };
    Task.prototype.deleteTask = function () {
        // Delete the task from local storage
        this.localStorage.deleteTask(this.id);
        console.log("Task deleted:", this);
    };
    Task.prototype.updateTask = function () {
        // Update the task in local storage
        this.localStorage.updateTask(this);
        console.log("Task updated:", this);
    };
    return Task;
}());
export default Task;
