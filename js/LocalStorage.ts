import Task from "./Task";

class LocalStorage {

    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private getTasksFromLocalStorage(): Task[] {
        const tasksJSON = localStorage.getItem(this.storageKey);
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }

    getAllTasks(): Task[] {
        return this.getTasksFromLocalStorage();
    }

    getTaskById(id: number): Task | undefined {
        const tasks = this.getTasksFromLocalStorage();
        return tasks.find(task => task.id === id);
    }

    saveTasksToLocalStorage(tasks: Task[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    createTask(task: Task): void {
        const tasks = this.getTasksFromLocalStorage();
        tasks.push(task);
        this.saveTasksToLocalStorage(tasks);
    }

    deleteTask(id: number): void {
        let tasks = this.getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== id);
        this.saveTasksToLocalStorage(tasks);
    }

    updateTask(updatedTask: Task): void {
        let tasks = this.getTasksFromLocalStorage();
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            this.saveTasksToLocalStorage(tasks);
        }
    }
}

export default LocalStorage;