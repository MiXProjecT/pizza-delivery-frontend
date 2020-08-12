import React, {Component} from 'react';
import {Button, Card, CardDeck} from 'react-bootstrap';

import Cart from '../services/cart.service'
import UserService from '../services/user.service';
import Currency from "../services/currency.service";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: [''],
            cart: localStorage.getItem('cart') ?
                new Map(JSON.parse(localStorage.getItem('cart'))) : new Map()

        };
    }

    componentDidMount() {
        UserService.getPublicContent().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    componentWillReceiveProps(props) {
        const currency = this.props;
        if (props.currency !== currency) {
            this.forceUpdate()
        }
    }

    addOrRemoveFromCart(action, name, price, count = 1) {
        this.setState({
            cart: Cart.addOrRemoveFromCart(action, name, price, count)
        })
    }

    render() {

        const {content, cart} = this.state

        return (
            <CardDeck>
                {content.map(product =>
                    <Card className={'menu-card'} key={product._id + 'card'}>
                        <Card.Img key={product._id + 'image'} id={product.name} variant='top' src={product.image}/>
                        <Card.Body key={product._id + 'body'}>
                            <Card.Title key={product._id + 'title'}> {product.name}</Card.Title>
                            <Card.Text key={product._id + 'text'}>
                                {product.description}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer key={product._id + 'footer'} className='d-flex justify-content-between'>
                            <span className={'price'} key={product._id + 'badge'} >
                                {Currency.convertCurrency(product.price)}
                            </span>

                            {!cart.has(product.name) ? (
                                <Button key={product._id + 'button1'}
                                        variant='primary'
                                        onClick={() =>
                                            this.addOrRemoveFromCart('add', product.name, product.price)}
                                >
                                    Add To Cart
                                </Button>

                            ) : (

                                <div className={'quantity'} key={product._id} hidden={!cart.has(product.name)}>
                                <span key={product._id + '-'}
                                      className={'quantity-button minus'}
                                      onClick={() => this.addOrRemoveFromCart('remove', product.name, product.price)}
                                >
                                    -
                                </span>
                                    <span className={'quantity-counter'}>{cart.get(product.name)['count']}</span>
                                    <span key={product._id + '+'}
                                          className={'quantity-button plus'}
                                          onClick={() => this.addOrRemoveFromCart('add', product.name, product.price)}
                                    >
                                    +
                                </span>

                                </div>
                            )}
                        </Card.Footer>
                    </Card>
                )}
            </CardDeck>
        );
    }
}
