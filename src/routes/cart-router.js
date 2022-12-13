import { Router } from "express";
import Cart from "../cart.js";

const cart = new Cart('./src/data/cart.txt');

const cartRouter = Router();

cartRouter.route('/')
    .post(async (req, res) => {
        res.json(await cart.create())
    });
cartRouter.route('/:id')
    .delete(async (req, res) => {
        const { id } = req.params
        res.json(await cart.deleteCartById(Number(id)))
    });

cartRouter.route('/:id/productos')
    .get(async (req, res) => {
        const { id } = req.params
        res.json(await cart.getCart(Number(id)))
    })
    .post(async (req, res) => {
        const { id } = req.params
        const { idProd } = req.body
        res.json(await cart.save(Number(id), Number(idProd)))
    });

cartRouter.route('/:id/productos/:id_prod')
    .delete(async (req, res) => {
        const { id, id_prod } = req.params
        res.json(await cart.deleteById(Number(id), Number(id_prod)))
    });

export default cartRouter;