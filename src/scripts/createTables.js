import {options} from "../config/databaseConfig.js"
import knex from "knex"

//instancia mysql
const mariaDB = knex(options.mariaDB);
// instancia sqlite
const sqliteDB = knex(options.sqliteDB);

// tabla de Productos
const createTables = async () => {
    try {
        let existe = await mariaDB.schema.hasTable("productos");
        if(existe){
            await mariaDB.schema.dropTable("productos");
        }

        await mariaDB.schema.createTable("productos",table=>{
            table.increments("id");
            table.string("title",40).nullable(false);
            table.integer("price").nullable(false);
            table.string("thumbnail",200).nullable(false)

        });
        console.log("tabla productos creata exitosamente");
        existe=false;
        existe = await sqliteDB.schema.hasTable("mensajes");
        if(existe){
            await sqliteDB.schema.dropTable("mensajes");
        }

        await sqliteDB.schema.createTable("mensajes",table=>{
            table.increments("id");
            table.string("email",30).nullable(false);
            table.string("fecha",20).nullable(false);
            table.string("mensaje",200).nullable(false)
        });
        console.log("tabla mensajes creata exitosamente");
    } catch (error) {
        console.log(error)   
    }
    mariaDB.destroy();
    sqliteDB.destroy();
 }

 createTables();