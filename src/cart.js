import fs from 'fs';
import Contenedor from './api.js';

const api = new Contenedor('./src/data/productos.txt');

class Cart {
    constructor(archivo) {
        this.archivo = archivo;
        this.carts = [];
        this.id = 0
    }

    async create() {
        const response = await this.getAll()
        let newId
        if (response.length === 0) {
            newId = 1
        }
        else {
            newId = response[response.length - 1].cartId + 1
        }
        const newCart = { cartId: newId, timestamp: Date.now(), productos: [] }
        response.push(newCart)
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(response, null, 2))
            return newCart
        }
        catch (err) {
            throw new Error(`error al crear carrito de compras: ${err}`)
        }
    }

    async save(cartId, productId) {
        const products = await api.getAll();
        const cartProduct = products.find(product => product.id === productId)
        const response = await this.getAll()
        const position = response.findIndex(cart => cart.cartId === cartId)
        response[position].productos.push(cartProduct);
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(response, null, 2))
            return 'Se agrego el producto al carrito';
        }
        catch (err) {
            throw new Error(`Error al guardar un nuevo objeto: ${err}`)
        }
    }

    /*     async save(id) {
            const products = await api.getAll();
            const cartProduct = products.find(product => product.id === id)
            const response = await this.getAll()
            response[response.length - 1].productos.push(cartProduct);
            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(response, null, 2))
                return 'Se agrego el producto al carrito';
            }
            catch (err) {
                throw new Error(`Error al guardar un nuevo objeto: ${err}`)
            }
        } */

    async getCart(id) {

        try {
            const response = await this.getAll()
            const search = response.find(item => item.cartId === id)
            return search
        }
        catch (err) {
            console.log(err);
        }
    }

    async getAll() {
        try {
            const response = await fs.promises.readFile(this.archivo, 'utf-8')
            return JSON.parse(response)
        }
        catch {
            return { error: "no se encontraron productos" };
        }
    }
    async deleteCartById(id) {
        const response = await this.getAll();
        const newResponse = response.filter(item => item.cartId !== id)
        if (newResponse.length === response.length) {
            return { error: "carrito no encontrado" }
        }
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(newResponse, null, 2))
            return 'carrito borrado';
        }
        catch (err) {
            throw new Error(`Error al borrar data: ${err}`)
        }
    }

    async deleteById(cartId, productId) {
        const response = await this.getAll();
        const array = [...response]
        const position = array.findIndex(cart => cart.cartId === cartId)
        //encuentro el carrito
        const findCart = response.filter((item) => item.cartId === cartId)
        //elimino el producto
        const remainingProducts = (findCart[0].productos).filter((item) => item.id !== productId)
        const newCart = { cartId: cartId, timestamp: Date.now(), productos: [...remainingProducts] }
        array[position] = newCart

        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(array, null, 2))
            return 'producto borrado';
        }
        catch (err) {
            throw new Error(`Error al borrar data: ${err}`)
        }
    }
}

export default Cart;
