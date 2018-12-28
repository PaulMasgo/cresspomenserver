const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config')
const Usuario = require('../models/Usuario');
const app = express();

app.post('/login', (req, res) => {
    let contenido = req.body;
    Usuario.findOne({ correo: contenido.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }
        if (!usuarioDB) {
            return res.status(400).json({ message: 'usuario o contraseña incorrecta' });
        }
        if (!bcrypt.compareSync(contenido.contraseña, usuarioDB.contraseña)) {
            return res.status(400).json({ message: 'usuario o contraseña incorrecta' });
        }
        let token = jwt.sign({ usuario: usuarioDB }, config.seed, { expiresIn: config.vencimientoToken });
        res.json({ ok: true, usuario: usuarioDB, token });
    })
});

module.exports = app;