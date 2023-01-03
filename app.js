const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();

// indicar que vamos a utilizar json
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_DATABASE = process.env.DB_DATABASE || 'quiz';
const DB_PORT = process.env.DB_PORT || 3306;

// establecemos los parámetros de la conexión
const connection = mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

// probamos la conexión
connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Successful connection');
    }
});

app.get('/', (req, res) => {
    res.send('Inital Route');
});

// mostrar todos los artículos
app.get('/api/usuarios', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    });
});

// mostrar solo un artículo
app.get('/api/usuarios/:id', (req, res) => {
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            throw err;
        } else {
            res.send(row);
            // res.send(row[0].descripcion);
        }
    });
});

// crear un articulo
app.post('/api/usuarios', (req, res) => {
    let data = {
        nombre: req.body.nombre
    }
    let sql = 'INSERT INTO users SET ?';
    connection.query(sql, data, (err, results) => {
        if (err) {
            throw err;
        } else {
            Object.assign(data, {id: results.insertId});
            res.send(data);
        }
    });
});

// editar articulos
app.put('/api/usuarios/:id', (req, res) => {
    let id = req.params.id;
    let nombre = req.body.nombre;

    let sql = "UPDATE users SET nombre = ? WHERE id = ?";

    connection.query(sql, [nombre, id], (err, results) => {
        if (err) {
            throw err;
        } else {
            res.send(results);
        }
    });
});

// eliminar articulos
app.delete('/api/usuarios/:id', (req, res) => {
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
        if(err) {
            throw err;
        } else {
            res.send(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log('Server on Port ' + PORT);
});