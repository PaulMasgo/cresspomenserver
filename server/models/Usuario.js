const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let esquema = mongoose.Schema;

let tiposValidos = {
    values: ['administrador', 'cliente'],
    message: '{VALUE} no existe'
}

let UsuarioSchema = new esquema({
    nombres: { type: String, required: [true, 'el nombre es obligatorio'] },
    apellidos: { type: String, required: [true, 'el apellido es obligatorio'] },
    correo: { type: String, required: [true, 'el correo es obligatorio'], unique: true },
    contraseña: { type: String, required: [true, 'la contraseña es obligatorio'] },
    tipo: { type: String, enum: tiposValidos, required: [true, 'el tipo de usuario es obligatorio'] },
    estado: { type: Boolean, default: true }
});

UsuarioSchema.plugin(uniqueValidator, { message: 'el {PATH} ya esta registrado' });

module.exports = mongoose.model('Usuario', UsuarioSchema)