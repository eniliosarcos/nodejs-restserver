const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            users: '/api/users',
            categorias: '/api/categorias',
            productos: '/api/productos'
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));
    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
        this.app.use(this.paths.categorias, require('../routes/categoria.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
    }

    listen() {

        this.app.listen(this.port, () =>{
            console.log(' Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;