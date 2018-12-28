const config = {};

//definiendo el puerto
config.puerto = process.env.PORT || 3000;

//Vencimineto del token
config.vencimientoToken = 60 * 60 * 24 * 30;

//Seed de Atenticacion
config.seed = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// Conectando a la base de datos mlab
config.estado = process.env.NODE_ENV || 'dev';
config.urlDB;


if (config.estado === 'dev') {
    config.urlDB = 'mongodb://localhost:27017/CrespoMen';
} else {
    config.urlDB = 'mongodb://admin:continental2019@ds141623.mlab.com:41623/cresspomen'
}

//exportando configuracui
module.exports = config;