import React, {Component} from 'react';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import {Accordion, Card, Button, Container, Row, Col, Image} from 'react-bootstrap';
import Currency from "../services/currency.service";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            orderList: null,
        };
    }


    componentDidMount() {
        UserService.getOrderList(this.state.currentUser.id).then(response => {
            console.log(response)
                if (response.data.order.length !== 0) {
                    this.setState({
                        orderList: response.data
                    })
                }
            }
        )

    }

    componentWillReceiveProps(props) {
        const currency = this.props;
        if (props.currency !== currency) {
            this.forceUpdate()
        }
    }


    render() {

        const orderList = this.state.orderList
        console.log(orderList)
        if(!orderList){
            return (
                    <div className={'empty-oder'}>
                        <Image className={'empty-cart-image'} src={require('../static/sadSmile.png')}/>
                        <span className={'empty-order-text'}>Your order list is empty </span>
                    </div>
            )
        }
        return (
            <Container>
                {orderList && orderList['order'].map(order => (
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Row>
                                <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                                    <Button className = 'close'>&darr;</Button>
                                </Accordion.Toggle>
                                        <Col>{new Date(order.date).toLocaleString()}</Col>
                                        <Col>{order.address}</Col>
                                        <Col>{Currency.convertCurrency(order.total_price)}</Col>
                                </Row>
                            </Card.Header>
                            <Accordion.Collapse eventKey='0'>
                                <Card.Body>{order.cart.map(cart =>
                                    <Row>
                                        <Col>{cart.product.name}</Col>
                                        <Col>
                                            {Currency.convertCurrency(cart.product.price) + ' x ' + cart.count}</Col>
                                    </Row>

                                )}
                                <Row>
                                    <Col>Delivery Price: </Col>
                                    <Col>10</Col>
                                </Row>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                ))}
            </Container>
        );
    }
}
