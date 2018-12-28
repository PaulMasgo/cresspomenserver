const jwt = require('jsonwebtoken');
const config = require('../config/config')

//verificacion de los tokens 
let verficartoken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, config.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: true, err });
        } else {
            req.usuario = decoded.usuario;
            next();
        }
    })
};

let verificarRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.tipo === 'administrador') {
        next();
        return
    } else {
        return res.json({
            ok: false,
            error: 'el usuario no es administrador'
        });
    }
};
module.exports = { verficartoken, verificarRol };