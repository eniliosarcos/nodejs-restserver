const path = require('path');
const fs = require('fs');

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const {Usuario, Producto} = require('../models');

const cargarArchivos = async(req=request, res = response) => {

    try {
        
        // imagenes
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({
          nombre
        });
    } catch (msg) {
        res.status(400).json({ msg});
    }
}

const actualizarImagen = async(req=request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){

                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){

                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }

    // Limpiar Imagenes previas
    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImagen)){

            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req=request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){

                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){

                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }

    // Limpiar Imagenes previas
    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImagen)){

            return res.sendFile(pathImagen);
        }
    }

    const pathDefalutImagen = path.join(__dirname, '../assets/no-image.jpg')

    res.sendFile(pathDefalutImagen);
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen
}