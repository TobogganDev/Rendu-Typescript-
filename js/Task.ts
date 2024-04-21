import Category from "./Category";
import ITask from "./ITask";
import LocalStorage from "./LocalStorage";

class Task implements ITask{
    
    id:number;
    title:string;
    description: string;
    date: string;
    priority: string;
    category: Category;
    localStorage: LocalStorage;

    constructor(title:string, description:string, date:string, priority:string, category:Category, localStorage:LocalStorage) {
        this.id = Math.floor(Math.random() * 1000000) + 1;;
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.category = category;
        this.localStorage = localStorage;
    }

    createTask(): void {
        // Save the task to local storage
        this.localStorage.createTask(this);
        console.log("Task created:", this);
    }
    
    deleteTask(): void {
        // Delete the task from local storage
        this.localStorage.deleteTask(this.id);
        console.log("Task deleted:", this);
    }

    updateTask(): void {
        // Update the task in local storage
        this.localStorage.updateTask(this);
        console.log("Task updated:", this);
    }
}

export default Task;