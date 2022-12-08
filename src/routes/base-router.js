import { Router } from "express";
import Contenedor from "../api.js";

const api = new Contenedor('./src/data/productos.txt');

const baseRouter = Router();

baseRouter.route('/:id?')
    .get(async (req, res) => {
        const { id } = req.params;
        id ? res.json(await api.getById(Number(id))) : res.json(await api.getAll());
    })

baseRouter.route('/')
    .post(async (req, res) => {
        const { title, price, thumbnail } = req.body;
        res.json(await api.save(title, price, thumbnail))
    })

baseRouter.route('/:id')
    .put(async (req, res) => {
        const { id } = req.params;
        const { title, price, thumbnail } = req.body;
        res.json(await api.replace(Number(id), { title, price, thumbnail }))
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        res.json(await api.deleteById(Number(id)))
    })

export default baseRouter;

