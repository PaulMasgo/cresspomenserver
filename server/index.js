const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//  aplicación de análisis / x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//  aplicación de análisis / json
app.use(bodyParser.json())

//habilitar la carpeta publica 
app.use(express.static(path.resolve(__dirname, '../public')))

//llamando a las rutas 
app.use(require('./routes/index'));

//conectandose a la base de datos
mongoose.connect(config.urlDB, { useNewUrlParser: true })
    .then(db => console.log('Estas conectado a la base de datos '))
    .catch(err => console.log('No de conecto'));

// Iniciando el servidor 
app.listen(config.puerto, () => {
    console.log('Escuchando en el puerto ' + config.puerto);
});