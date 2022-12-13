import express, { json, urlencoded } from 'express';
import baseRouter from './routes/base-router.js';
import cartRouter from './routes/cart-router.js';

const app = express()

app.use(json());

app.use(urlencoded({ extended: true }));

const admin = true;

const checkAdmin = (req, res, next) => {
    if (admin) {
        next();
    } else {
        res.json({ error: -1, descripcion: `ruta ${req.path} método ${req.method} no autorizada` })
    }
}

app.use('/api/productos', baseRouter);
app.use('/api/carrito', checkAdmin, cartRouter);

app.use((req, res, next) => {
    res.json({ error: -2, descripcion: `ruta ${req.path} método ${req.method} no implementada` })
})

app.listen('3000', () => {
    console.log("listening port 3000");
})

app.on('error', (err) => {
    console.log(err);
})