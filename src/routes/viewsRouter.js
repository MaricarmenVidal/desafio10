import fs from "fs";
import express from "express";
import { getProductsFilePath, configureMulter } from "../util.js";
import { io } from "../app.js";

const viewRouter = express.Router();
const productoFilePath = getProductsFilePath();
const imgUpload = configureMulter();

viewRouter.get("/", (req, res) => {
    res.render("home");
});

// Ruta para renderizar la vista de productos en tiempo real
viewRouter.get("/realtimeproducts", (req, res) => {
    try {
        // Lee los datos del archivo 'products.json'
        const rawData = fs.readFileSync(productoFilePath);
        const productos = JSON.parse(rawData);

        res.render("realTimeProducts", { productos });
    } catch (error) {
        console.error("Error al leer el archivo productos.json:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Manejar la solicitud de agregar un producto en tiempo real
viewRouter.post("/realtimeproducts/addProducts", imgUpload.single("image"), (req, res) => {
    try {
        console.log("Solicitud recibida");
        
        // Leer los datos del archivo 'products.json'
        const rawData = fs.readFileSync(productoFilePath);
        let productos = JSON.parse(rawData);

        // Obtener los datos del nuevo producto
        const { title, description, price, stock, category } = req.body;
        
        console.log("Datos del producto recibidos:", title, description, price, stock, category);
        console.log("Archivo de imagen recibido:", req.file);

        const imageName = req.file ? req.file.filename : null;

        if (!imageName) {
            return res.status(400).json({ error: 'No se envió una imagen válida' });
        }

        // Agregar el nuevo producto al arreglo de productos
        const newProduct = {
            id: productos.length + 1,
            title,
            description,
            price,
            stock,
            category,
            image: imageName
        };
        productos.push(newProduct);

        // Escribir los productos actualizados en el archivo 'products.json'
        fs.writeFileSync(productoFilePath, JSON.stringify(productos, null, 2));

        // Emitir el evento 'newProduct' a todos los clientes conectados
        io.emit('newProduct', newProduct);
        
        console.log("Producto agregado:", newProduct);

        // Redirigir al usuario de nuevo a la página de realtimeproducts
        res.redirect("/realtimeproducts");
    } catch (error) {
        console.error("Error al agregar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


export default viewRouter;