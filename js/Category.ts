import ICategory from "./ICategory";

class Category implements ICategory{

    id:number;
    name:string;
    constructor(name:string) {
        this.id = Math.floor(Math.random() * 1000000) + 1;
        this.name = name;
    }
}

export default Category;