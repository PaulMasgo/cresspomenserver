const express = require('express');
const Producto = require('../models/producto')
const app = express();

app.get('/productos', (req, res) => {
    res.send('get usuario');
});

app.post('/productos', (req, res) => {

    let contenido = req.body;

    let producto = new Producto({
        nombre: contenido.nombre,
        descripcion: contenido.descripcion,
        precio: contenido.precio,
        stock: contenido.stock,
        categoria: contenido.categoria
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err })
        } else {
            res.json({ ok: true, productoNuevo: producto });
        }
    })
});

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    res.send(`get user: ${id}`);
});

app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id: id, contenido: req.body });
});


module.exports = app;