var LocalStorage = /** @class */ (function () {
    function LocalStorage(storageKey) {
        this.storageKey = storageKey;
    }
    LocalStorage.prototype.getTasksFromLocalStorage = function () {
        var tasksJSON = localStorage.getItem(this.storageKey);
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    };
    LocalStorage.prototype.getAllTasks = function () {
        return this.getTasksFromLocalStorage();
    };
    LocalStorage.prototype.getTaskById = function (id) {
        var tasks = this.getTasksFromLocalStorage();
        return tasks.find(function (task) { return task.id === id; });
    };
    LocalStorage.prototype.saveTasksToLocalStorage = function (tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    };
    LocalStorage.prototype.createTask = function (task) {
        var tasks = this.getTasksFromLocalStorage();
        tasks.push(task);
        this.saveTasksToLocalStorage(tasks);
    };
    LocalStorage.prototype.deleteTask = function (id) {
        var tasks = this.getTasksFromLocalStorage();
        tasks = tasks.filter(function (task) { return task.id !== id; });
        this.saveTasksToLocalStorage(tasks);
    };
    LocalStorage.prototype.updateTask = function (updatedTask) {
        var tasks = this.getTasksFromLocalStorage();
        var index = tasks.findIndex(function (task) { return task.id === updatedTask.id; });
        if (index !== -1) {
            tasks[index] = updatedTask;
            this.saveTasksToLocalStorage(tasks);
        }
    };
    return LocalStorage;
}());
export default LocalStorage;
