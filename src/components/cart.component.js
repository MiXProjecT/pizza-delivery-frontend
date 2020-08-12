import React, {Component} from 'react';
import {Modal, Button, Row, Col, Card, CardDeck, Image, Form, Toast} from 'react-bootstrap';
import Cart from '../services/cart.service'
import Currency from '../services/currency.service'

export default class CartComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            cart: new Map(),
            submitOrder: false,
        };
    }

    handleModal() {
        this.setState({
                show: !this.state.show,
                cart: new Map(JSON.parse(localStorage.getItem('cart'))),
            }
        )
    }

    handleCheckoutMenu() {
        this.setState({submitOrder: !this.state.submitOrder})
    }

    placeOrder(address, phone_number) {             //Terrible crutch, never did that in my entire life
        Cart.placeOrder(address, phone_number)
        this.handleModal()
        alert('Order was created successfully')
        localStorage.removeItem('cart')
        window.location.reload(false);
    }

    cartContent() {
        if (this.state.cart.size > 1) {
            if (!this.state.submitOrder) {
                return (
                    <CardDeck>
                        {Array.from(this.state.cart).map(([key, value]) => {
                            if (key !== 'totalPrice') {
                                return (
                                    <Card key={key + 'card'} className={'cart-body'}>
                                        <Card.Body key={key + 'body'} className={'cart-product'}>
                                            <Row>
                                                <Col>
                                                    <Image key={key + 'image'} className={'cart-image'}
                                                           src={document.getElementById(key).src}/>
                                                </Col>

                                                <Col>
                                                    <span key={key + 'count'}>
                                                        {Currency.convertCurrency(value.price,)}
                                                    </span>
                                                </Col>
                                                <Col>
                                                    <span key={key + 'count'}>{value['count']}</span>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                )
                            }
                        })}
                    </CardDeck>
                )
            } else {
                return (
                    <Form>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control required type='text' placeholder='Enter address' id={'address'}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control
                                id={'phone'}
                                required type='text'
                                placeholder='Phone number'
                                defaultValue={localStorage.getItem('user') ?
                                    JSON.parse(localStorage.getItem('user'))['phone'] : ''}
                            />
                        </Form.Group>
                    </Form>
                )
            }
        } else {
            return (
                <div className={'empty-cart'}>
                    <Image className={'empty-cart-image'} src={require('../static/sadSmile.png')}/>
                    <span className={'empty-cart-text'}>Your cart is empty </span>
                </div>
            )
        }
    }

    render() {

        const {show, cart, submitOrder} = this.state

        return (
            <>
                <Button hidden={window.location.pathname !== '/'} variant='primary' onClick={() => {
                    this.handleModal()
                }}>
                    <Image className={'cart-icon'} src={require('../static/cart.png')}/>
                    Show Cart
                </Button>

                <Modal show={show} onHide={() => {
                    this.handleModal()
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.cartContent()}</Modal.Body>
                    {cart.get('totalPrice') !== 0 && cart.get('totalPrice') !== undefined &&
                    <Modal.Footer className={'d-flex justify-content-between'}>
                        <div>
                            <b>Total Price + Delivery: </b>
                            {Currency.convertCurrency(cart.get('totalPrice'), 10)}
                        </div>
                        <Button hidden={!submitOrder} variant='secondary' onClick={() => {
                            this.handleCheckoutMenu()
                        }}>
                            Back to Cart
                        </Button>
                        <Button
                            variant='primary'
                            type={'button'}
                            onClick={() => {
                                submitOrder ?
                                    this.placeOrder(document.getElementById('address').value,
                                        document.getElementById('phone').value)
                                    :
                                    this.handleCheckoutMenu()
                            }}>
                            Place Order
                        </Button>
                    </Modal.Footer>
                    }
                </Modal>
            </>
        );
    }
}
