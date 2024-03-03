import { io } from "../../app";

const socket = io();

// Manejar el envío del formulario para agregar un producto
document.getElementById('addProductForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').files[0];

    console.log('Datos del producto:', title, description, price, stock, category, image);

    // Crear un objeto FormData para enviar datos de formulario y archivos
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('image', image);

    // Emitir el evento addProduct al servidor de WebSocket con los datos del producto
    socket.emit('addProduct', formData);

    // Resetear el formulario después de enviar los datos
    event.target.reset();
});

