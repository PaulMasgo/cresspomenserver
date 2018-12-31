const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.clientId);

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

//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token['idtoken'],
        audience: config.clientId, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true,
    }
};

app.post('/google', async(req, res) => {

    let token = req.body.idToken;
    let googleUser = await verify(token)
        .catch(err => { return res.status(403).json({ ok: false, err }) });

    // res.json({ usuario: googleUser });

    Usuario.findOne({ correo: googleUser.correo }, (err, usuarioDB) => {
        if (err) {
            return res.json({ mensaje: 'hubo un error', error: err })
        };
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({ mensaje: 'Debe usar la uatenticación normal' })
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, config.seed, { expiresIn: config.vencimientoToken });
                return res.json({ ok: true, usuario: usuarioDB, token });
            };
        } else {
            let usuario = new Usuario();
            usuario.nombres = googleUser.nombre
            usuario.correo = googleUser.correo
            usuario.img = googleUser.img
            usuario.google = true
            usuario.contraseña = 'default'
            usuario.tipo = 'cliente'

            console.log(usuario);
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.json({ mensaje: 'hubo un error', error: err });
                };
                let token = jwt.sign({ usuario: usuarioDB }, config.seed, { expiresIn: config.vencimientoToken });
                return res.json({ ok: true, usuario: usuarioDB, token });
            });
        }



    })
})

module.exports = app;