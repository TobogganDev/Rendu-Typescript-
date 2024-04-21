import Category from "./Category";

interface ITask {
  id: number;
  title: string;
  description: string;
  date: string;
  priority: string;
  category: Category;
}

export default ITask;