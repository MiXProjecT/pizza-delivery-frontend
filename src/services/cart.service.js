import axios from 'axios'

class Cart {

    addOrRemoveFromCart(action, name, price, count = 1) {

        let cart = new Map(JSON.parse(localStorage.getItem('cart')));

        if (!cart.get('totalPrice')) {
            cart.set('totalPrice', 0)
        }

        switch (action) {

            case 'add':

                if (localStorage.getItem('cart')) {
                    cart = new Map(JSON.parse(localStorage.getItem('cart')));
                    if (cart.has(name)) {
                        cart.set(name, {'price': price, 'count': cart.get(name)['count'] + 1});
                        cart.set('totalPrice', cart.get('totalPrice') + price + null)
                        localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
                        break;
                    }
                }
                cart.set(name, {'price': price, 'count': count});
                cart.set('totalPrice', cart.get('totalPrice') + price)
                localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
                break;

            case 'remove':

                if (cart.get(name)['count'] > count) {
                    cart.set(name, {'price': price, 'count': cart.get(name)['count'] - count});
                } else {
                    cart.delete(name)
                }


                cart.set('totalPrice', cart.get('totalPrice') - price)
                localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
                break;

            default:
                break;
        }
        return cart
    }

    placeOrder(address, phone_number) {
        const user_id = localStorage.getItem('user') ?
            JSON.parse(localStorage.getItem('user'))['id']
            :
            '5f31c2c0bdbb3449588d6b7d'
        let cart = new Map(JSON.parse(localStorage.getItem('cart')))
        cart.delete('totalPrice')
        axios.post('http://localhost:8080/api/createorder/', {
            user_id: user_id,
            address: address,
            phone_number: phone_number,
            cart: Array.from(cart.entries())

        })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
    }
}


export default new Cart();
