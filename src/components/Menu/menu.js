import React, { Component, useState } from 'react';
import Axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactDOM from 'react-dom';

import {Navbar, Nav, NavDropdown, Button, Container} from 'react-bootstrap';
import {
    Card, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody, Row, Col
  } from 'reactstrap';
  import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
import i18n from '../../i18n';

import firstImage from './muffins.jpg'
import secondImage from './fajita.jpg'
import thirdImage from './hurmasice.jpg'
import fourhtImage from './kroketi.jpg'
import fifthImage from './ahmedije.jpg'
import sixthImage from './ustipci.jpg'


import './menu.css';

export default class Menu extends Component {
    state= {
      id: 0,
      recipe: [],
      price: 0,
      officialPrice: 0,
      bonusPrice: 0,
      offerStart: "",
      offerEnd: "",

      totalPrice: 0,
      orders: [],
      idFinish: false,
      modal: false,
      visibility: true,

      finalOrders: {},
      ordersName: [],
      ordersCol: [],
      imagesRecipe: [
        firstImage,
        secondImage,
        thirdImage,
        fourhtImage,
        fifthImage,
        sixthImage
    ]
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal }, () => {
            this.finish();
        })
    }

    componentDidMount =() => {
        console.log(this.state.imagesRecipe[0])
        let id = 0;
        Axios.get("https://localhost:44342/meals/recipes", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            console.log("Tu sam!");
            console.log(res);
            
            this.setState({
                recipe: res.data
            })
            //id = res.data.specialOffer;
            console.log(this.state);

        })
        /*.then(res => {
            Axios.post("https://localhost:44342/orders", {
                
            })
        })*/
        .catch((e) => {
            console.log(e);
            alert("Niste logovani!");
        })
    }

    order =(sp, p, n) => {
        console.log("order", sp, p);
;        if (sp != null) {
            this.setState({ totalPrice: this.state.totalPrice + p - sp * p / 100});
            
        } else {
            this.setState({ totalPrice: this.state.totalPrice +  p });
        }
        this.setState({ orders: [...this.state.orders, n]});
        alert("Jedan proizvod naručen!");
    }

    mess =() => {
        ReactDOM.render(<p>Narudžba poslana!</p>, document.getElementById('body'));
        if (this.state.visibility == false){
            document.getElementById("narudzba").style.visibility = "hidden";
            document.getElementById("odustani").style.visibility = "hidden";
        }
    }
    
    finish =() => {
        if (localStorage.getItem("token") == null) {
            alert ("niste logovani!");
            return;
        } 
        this.setState({ visibility: false });
        this.setState({ isFinis: !this.state.isFinis });
        console.log("Funkcija Finish");
        var arr = this.state.orders;
        var a = [], b = [], prev;
        arr.sort();
        for ( var i = 0; i < arr.length; i++ ) {
            if ( arr[i] !== prev ) {
                a.push(arr[i]);
                b.push(1);
            } else {
                b[b.length-1]++;
            }
            prev = arr[i];
        }
        console.log("Nizovi")
        console.log(a);
        console.log(b);

        let o = {};
        for (let i=0; i<a.length; i++){
            o[a[i]] = b[i]
        }
        this.setState({
            ordersName: a,
            ordersCol: b
        }, () => {
            console.log(this.state.ordersName);
            console.log(this.state.ordersCol);
        })
        
    }

    renderImages = (a) => {
        if(true) return './muffins.jpg'
    }


    render(){
        return(
            <div>
                <div>
                    <Button color="warning" onClick={this.toggle} id="finish-btn">{i18n.t('Završi narudžbu')}</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                        <ModalBody id="body">
                            <ul>
                                {this.state.ordersName.map((o, i) => {
                                    return ( <li key={i}>{o}: {this.state.ordersCol[i]}</li> )
                                })}
                            </ul>
                            </ModalBody>
                            <ModalFooter id="footer">
                            <Button id="narudzba" color="warning" onClick={this.mess} className="modal-btn">OK</Button>{' '}
                            <Button id="odustani" color="warning" onClick={this.toggle} className="modal-btn">{i18n.t('Prekini narudžbu')}</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <div id="meal">
                    <div>
                        <div id="menu-page-img"></div>
                        <h1 id="menu-page">{i18n.t('Menu')}</h1>
                        <br/><br/><br/>
                        <Container><Row>
                        { this.state.recipe.map((y, i) => {
                            return <Col md="6">
                                 <CardImg top width="100%" src={this.state.imagesRecipe[i]} alt="Card image cap" />
                                {
                                    y.recipe.map((x, j) => {
                                        return <CardBody key={j}>
                                                <CardTitle name="name" >{i18n.t(`${x.name}`)}</CardTitle>
                                                <CardSubtitle className="price">{y.price} KM</CardSubtitle>
                                                <CardText className="ingredients">{i18n.t(`${x.ingredients}`)}</CardText>
                                                <Button as={Link} onClick={() => this.order(y.specialOffers[0]? y.specialOffers[0].discount : null, y.price, x.name) }>{i18n.t('Naruči')}</Button>
                                        </CardBody>
                                    })
                                }
                            </Col>
                        })}
                        </Row></Container>
                    </div>
                </div>
            </div>
        )
    }
}