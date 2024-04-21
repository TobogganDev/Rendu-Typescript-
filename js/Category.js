var Category = /** @class */ (function () {
    function Category(name) {
        this.id = Math.floor(Math.random() * 1000000) + 1;
        this.name = name;
    }
    return Category;
}());
export default Category;
