import express from 'express';
import path from "path";
import {Server} from "socket.io";
import handlebars from'express-handlebars';

import { Router, text } from 'express';
import {options} from "./config/databaseConfig.js"
import ContenedorSql from './managers/contenedorSql.js';

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const viewsFolder = path.join(__dirname,"./src/views")
const app = express();

const PORT = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"))


app.engine("handlebars",handlebars.engine())

app.set("view engine", "handlebars")
app.set("views",viewsFolder)
const manejador = new ContenedorSql(options.mariaDB, "productos"); //new Contenedor("productos.txt");
const chat = new ContenedorSql(options.sqliteDB, "mensajes"); //new Chat("mensajes.txt");

const routerProductos = Router();

const server = app.listen( PORT, ()=>{
    console.log(`Servidor escuchando el puerto: ${PORT}`);
});

routerProductos.get("/",async(req,res)=>{
    try {
        const resp = await manejador.getAll();
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

routerProductos.get("/:id",async (req,res)=>{
    try {
        const resp = await manejador.getById(req.params.id);    
        res.status(200).json(resp)
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

routerProductos.post("/",async (req,res)=>{
    try {
        const resp = await manejador.save(req.body);
        res.status(200).json(resp)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

routerProductos.delete("/:id",async (req,res)=>{
    //console.log("deleteProducto: ",req.params.id);
    try {
        const resp = await manejador.deleteById(req.params.id);
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

routerProductos.delete("/",async (req,res)=>{
    //console.log("deleteProducto: ",req.params.id);
    try {
        const resp = await manejador.deleteAll();
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

routerProductos.put("/:id",async (req,res)=>{
    //console.log("deleteProducto: ",req.params.id);
    try {
        const resp = await manejador.update(req.params.id,req.body);
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error.message);
    }
});



app.use('/api/productos', routerProductos);

app.post("/productos", async (req, res) => {
    const resp = await manejador.save(req.body);
    res.redirect('/')
})
app.get("/productos",async (req,res)=>{

    const resp = await manejador.getAll();

    console.log("productos: ",resp.data)

    res.render("listado",{
        productos: resp.data,
        total: resp.data.length
    })
})

//configurar el socket del lado del backend
const io = new Server(server);
io.on("connection", async(socket)=>{
    console.log("nuevo cliente conectado");
    
   try {
     //cada vez que el socket se conecte le enviamos los productos
     socket.emit("productsArray", await manejador.getAll());

     //recibir el producto
     socket.on("newProduct", async(data)=>{
         console.log("nuevo producto: ",data)
         //data es el producto que recibo del formulario
         try {
             const resp = await manejador.save(data);
         } catch (error) {
             console.log("error1: ",error)
         }
 
         //enviar todos los productos actualizados
         io.sockets.emit("productsArray", await manejador.getAll());
 
     })
 
     //chat
     //enviar los mensajes al cliente
     socket.emit("messagesChat", await chat.getAll());
 
     //recibimos el mensaje
     socket.on("newMsg", async (msg)=>{
         //console.log("mensaje: ",msg)
         await chat.save(msg)
         //enviamos los mensajes a todos los sockets que esten conectados.
         io.sockets.emit("messagesChat", await chat.getAll())
     })
   } catch (error) {
        console.log("error2:",error);
   }
})

