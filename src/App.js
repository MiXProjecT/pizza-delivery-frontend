import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Nav, Navbar, Container, ButtonGroup, ToggleButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';
import Currency from "./services/currency.service";

import CartComponent from './components/cart.component';
import Login from './components/login.component';
import Register from './components/register.component';
import Home from './components/home.component';
import Profile from './components/profile.component';
import BoardAdmin from './components/board-admin.component';

class App extends Component {

    constructor(props) {
        super(props);

        if (!localStorage.getItem('currency')) {
            Currency.chooseCurrency('dollar')
        }

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
            refresh: false
        };
    }


    componentDidMount() {

        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.roles.includes('ROLE_ADMIN')
            });
        }
    }

    changeCurrency = () =>
        this.setState({refresh: !this.state.refresh})

    currencyChange(checked) {
        Currency.chooseCurrency(checked)
        this.changeCurrency()
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const {currentUser, showAdminBoard} = this.state;

        return (

            <Router>
                <Navbar bg='dark' variant='dark'>
                    <Navbar.Brand href='/'>Pizza Delivery</Navbar.Brand>
                    <Nav className='mr-auto'>
                        {showAdminBoard && (
                            <Nav.Link href='/admin'>Admin</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        <ButtonGroup className={'button-group'} toggle>
                            <ToggleButton
                                key={'1'}
                                type="radio"
                                variant="secondary"
                                name="radio1"
                                checked={JSON.parse(localStorage.getItem('currency'))[0] === '$'}
                                onChange={e => this.currencyChange(e.target.value)}
                                value = {'dollar'}

                            >
                                $
                            </ToggleButton>
                            <ToggleButton
                                key={'2'}
                                type="radio"
                                variant="secondary"
                                name="radio1"
                                checked={JSON.parse(localStorage.getItem('currency'))[0] === '€'}
                                onChange={e => this.currencyChange(e.target)}
                                value = {'euro'}
                            >
                                €
                            </ToggleButton>
                        </ButtonGroup>
                        <CartComponent/>
                        {currentUser ? (
                            <>
                                <Nav.Link className={'mr-sm-2'} href='/profile'>{currentUser.username}</Nav.Link>
                                <Nav.Link href='/login' onClick={() => this.logOut()}>Log out</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link href='/login'>Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar>
                <Container>
                    <Switch>
                        <Route exact path={'/'} component={() => <Home currency={this.changeCurrency}/>}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <Route exact path='/profile'component={() => <Profile currency={this.changeCurrency}/>}/>
                        <Route path='/admin' component={BoardAdmin}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
