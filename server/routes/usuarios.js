const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { verficartoken, verificarRol } = require('../middlewares/autenticacion')
const app = express();

app.get('/usuario', (req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombres apellidos correo estado')
        .skip(desde)
        .limit(15)
        .exec((err, Usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, error: err })
            } else {
                res.json(Usuarios);
            }
        })
});

app.post('/usuario', (req, res) => {

    let contenido = req.body;
    let usuario = new Usuario({
        nombres: contenido.nombres,
        apellidos: contenido.apellidos,
        correo: contenido.correo,
        contraseña: bcrypt.hashSync(contenido.contraseña, 10),
        tipo: contenido.tipo,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err })
        } else {
            res.json({ ok: true, usuarioNuevo: usuarioDB });
        }
    })
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let contenido = req.body;
    contenido.contraseña = bcrypt.hashSync(contenido.contraseña, 10)

    Usuario.findOneAndUpdate(id, contenido, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err })
        } else {
            res.json({ ok: true, usuarioActualizado: usuarioDB });
        }
    });

});

app.delete('/usuario/:id', [verficartoken, verificarRol], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, UsuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err })
        } else {
            res.json({ ok: true, usuarioActualizado: UsuarioBorrado });
        }
    })
});


module.exports = app;