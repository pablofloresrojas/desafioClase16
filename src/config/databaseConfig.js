import path from "path";

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const options = {
    //bd de productos
    mariaDB:{
        client:"mysql",
        connection:{
            host:"127.0.0.1",
            user:"root",
            password:"",
            database:"desafioClase16"
        }
    },
    //bd de mensajes
    sqliteDB:{
        client:"sqlite",
        connection:{
            filename:path.join(__dirname,"../DB/ecommerce.sqlite")
        },
        useNullAsDefault:true
    }
};
