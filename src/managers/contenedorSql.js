import knex from "knex";
//import mysql from "mysql";

//const database = knex(options)

export class ContenedorSql {

    constructor(options,tableName){
        this.database = knex(options);
        this.table = tableName;
    }

    async getAll(){
        try {
            //obtener registros de la tabla
            const resp = await this.database.from(this.table).select("*");
            return resp;
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
        }
    }

    async save(producto){
        try {
            //obtener registros de la tabla
            const resp = await this.database.from(this.table).insert(producto);
            return resp;
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
        }
    }

    async getById(id){
        try {
            const [producto] = await this.database.from(this.table).where("id",id).select("*");
            if(producto){
                return producto;
            }else{
                return `Producto ID=${id} no encontrado`;
            }
            
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
        }
    }

    async deleteById(id){
        try {
            const deleted = await this.database.from(this.table).delete().where("id",id);
            return `Producto eliminado ID=${id}`;
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
            
        }
    }

    async deleteAll(id){
        try {
            const deleted = await this.database.from(this.table).delete();
            return `Productos eliminados`;
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
            
        }
    }

    async update(id,data){
        try {
            const updated = await this.database.from(this.table).where("id",id).update(data);
            return `Producto  ID=${id} actualizado`;
        } catch (error) {
            console.log("error: ",error);
            return `error: ${error}`;
            
        }
    }
}

export default ContenedorSql;