
//este repositorio general recibe un dao y un modelo,que es donde se va a estar trabajando.
export default class GenericRepository{
    constructor(dao,model){
        this.dao = dao;
        this.model = model;
    }

    getAll = () => this.dao.get(this.model);
    saveObject = (doc) => this.dao.save(doc,this.model);
    getByOptions = (option) => this.dao.getBy(option,this.model);
    updateById = (id,doc) => this.dao.updateId(id,doc,this.model);//este metodo me permite actualizar todo el objeto.
    updateOneProperty = (param,newProp) => this.dao.updateProp(param,newProp,this.model);//este metodo me permite actualizar una propiedad del objeto.
    deleteById = (id) => this.dao.deleteId(id,this.model);
}