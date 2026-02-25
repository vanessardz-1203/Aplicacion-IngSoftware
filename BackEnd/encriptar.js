const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function procesarContraseñasDeDB() {
    // 1. Configuración de tu conexión
    const config = {
        host: 'localhost',
        user: 'root',
        password: '', //Aqui ponen su contraseña de mySQL
        database: 'mydb'
    };

    let connection;

    try {
        connection = await mysql.createConnection(config);
        console.log("--- Conectado a MySQL ---\n");

        // 2. Traer los datos de la tabla Mesero
        const [filas] = await connection.execute('SELECT nombre, contraseña FROM Mesero');

        // 3. Iterar y mostrar la encriptación en consola
        for (let usuario of filas) {
            const passwordPlano = usuario.contraseña;
            
            // Genera el hash para este usuario específico
            const hash = await bcrypt.hash(passwordPlano, saltRounds);

            console.log(`Usuario: ${usuario.nombre}`);
            console.log(`  Original (en DB): ${passwordPlano}`);
            console.log(`  Encriptado (Hash): ${hash}`);
            console.log('-------------------------------------------');
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

procesarContraseñasDeDB();