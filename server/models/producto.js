const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let esquema = mongoose.Schema;
let productoSchema = new esquema({
    nombre: { type: String, unique: true, required: [true, 'El Nombre es nesesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es nesesaria'] },
    precio: { type: Number, required: [true, 'El precio es nesesario'] },
    stock: { type: Number, required: [true, 'El stock es nesesario'] },
    categoria: { type: Number, required: [true, 'El precio es nesesario'] }
});

productoSchema.plugin(uniqueValidator, { message: 'el {PATH} ya esta registrado' })

module.exports = mongoose.model('Producto', productoSchema);