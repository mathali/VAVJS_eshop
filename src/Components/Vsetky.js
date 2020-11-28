import React, { useEffect, useState } from 'react';

import Product from './Product';
import Item from './Item';
import Form from './Form';
import Thank_you from './Thank_you';
import Admin from './Admin';

var admin = window.location.hash && window.location.hash.substring(1) == 'admin';

class Vsetky extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            isLoaded: false,
            items: [],
            isCart: false,
            dontRender: [],
            isForm: false,
            sum: 0,
            isThanks: false,
            adminOrders: [],
            loadedAdmin: false,
            hitCount: 0,
        };
        this.unmountChild = this.unmountChild.bind(this);
        this.remountChild = this.remountChild.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    getProducts(){    
        fetch('/product_data')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    products: data,
                    isLoaded: true,
                })
            });
    }

    renderProducts() {
        return this.state.products.map((product,index)=>{
            return <Product
                key={product.id}
                title={product.name}
                cost={product.cost}
                image={product.image_src}
                remount = {this.remountChild} />
        });
    }

    renderThankYou(){
         return <Thank_you/>
    }

    renderAdmin(){
        if(this.state.loadedAdmin){
            return this.state.adminOrders.map((order,index)=>{
                return <Admin
                    key={order.key}
                    id={order.id}
                    amount={order.amount}
                    customerName={order.customerName}
                    customerEmail={order.customerEmail}
                    productName={order.productName}
                    state={order.state}/>
            });
        }
        return null;
    }

    getCart(){
        fetch('/cart_data')
            .then(res => res.json())
            .catch(error=>{
                console.log("[INFO] Empty Cart");
                this.setState({
                    items: [],
                    isCart: true,
                })
            })
            .then(data => {
                this.setState({
                    items: data,
                    isCart: true,
                })
            });
    }

    createOrder(customer){
        fetch('/create_order',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                customer: customer,
                order: this.state.order
            }),
          credentials: 'same-origin'
      });
      this.setState({
            isForm: false,
            isThanks: true
        });
    }

    renderItems(){
        if(this.state.items == undefined || this.state.items.length < 1) return null;
        return this.state.items.map((item,index)=>{
            for(var i = 0; i < this.state.dontRender.length; i++){
                if(this.state.dontRender[i] == item.title) return null;
            }
            return <Item
                key={index}
                title={item.title}
                amount={item.amount}
                cost={item.cost}
                unmountChild={this.unmountChild}
                updateAmount={this.updateAmount}/>
        });
    }

    renderForm(){
        return <Form
            createOrder={this.createOrder}/>;
    }

    unmountChild(title){
        var flag;
        if(this.state.dontRender != undefined){
            var ph = this.state.dontRender;
            for(var i = 0; i < ph.length; i++){
                if(ph[i] == title){
                    flag=true;
                }
            }
            if(!flag)ph.push(title);
            this.setState({dontRender: ph});
        }else{
            this.setState({dontRender: [title]});
        }
    }

    updateAmount(title, amount){
        var ph = this.state.items;
        for(var i = 0; i < ph.length; i++){
            if(ph[i].title == title){
                ph[i].amount = amount;
                break;
            }
        }
        this.setState({items: ph});
    }

    remountChild(title){
        if(this.state != undefined && this.state.dontRender != undefined){
            var ph = this.state.dontRender;
            for(var i = 0; i < ph.length; i++){
                if(ph[i] == title){
                    ph.splice(i, 1);
                }
            }
            this.setState({dontRender: ph});
        }
    }

    setOrder(){
        this.setState({isForm: true})
        var ph_order;
        var toRemove = [];
        var sum = 0;
        if(this.state.items != undefined && this.state.items.length > 0){
            ph_order = this.state.items;
            for(var i = 0; i < this.state.items.length; i++){
                if(this.state.dontRender != undefined){
                    for(var j = 0; j < this.state.dontRender.length; j++){
                        if(this.state.dontRender[j] == this.state.items[i].title){
                            toRemove.push(i);
                        }
                    }
                }
            }
            if(toRemove.length > 0){
                for(var i = toRemove.length-1; i >= 0; i--){
                    ph_order.splice(toRemove[i], 1);
                }
            }
            this.setState({order: ph_order});
            for(var i = 0; i < ph_order.length; i++){
                sum += ph_order[i].amount * ph_order[i].cost;
            }
        }
        this.setState({sum: sum});
    }

    adminGet(){
        fetch('/admin_orders').then(res => res.json())
            .then(data => {
                this.setState({
                    adminOrders: data.result,
                    hitCount: data.hit_count.hit_count,
                    loadedAdmin: true,
                })
            });
    }


    render(){
        if(!this.state.isLoaded)this.getProducts();
        if(!this.state.loadedAdmin)this.adminGet();
        if(admin){
            return(
                <div className='admin_page'>
                    <div className='refresh'>
                        <button onClick={()=>this.adminGet()}>Refresh</button>
                    </div><br/>
                    <div className="hit_count">
                        <p>Add click counter: </p> <h2>{this.state.hitCount}</h2>
                    </div><br/>
                    <div className="admin_div">
                        <div className="order_id">
                            <h2>ID</h2>
                        </div>
                        <div className="order_amount">
                            <h2>Amount</h2>
                        </div>
                        <div className="order_cname">
                            <h2>Customer Name</h2>
                        </div>
                        <div className="order_email">
                            <h2>Customer Email</h2>
                        </div>
                        <div className="order_pname">
                            <h2>Product Name</h2>
                        </div>
                        <div className="order_state">
                            <h2>State</h2>
                        </div>
                    </div><br/>
                    <div>{this.renderAdmin()}</div><br/>
                    <hr/>
                </div>
            )
        }
        else if(this.state.isLoaded && !this.state.isCart && !this.state.isForm) {
            return (
                <div className = 'product_page'>
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px'
                        onClick={()=>this.getCart()}/>
                    </div>
                    <hr/>
                    <div>
                        {this.renderProducts()}
                    </div>
                </div>
            );
        }
        else if (this.state.isCart && !this.state.isForm && !this.state.isThanks){
            return (
                <div className = 'cart_page'>
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'
                            onClick={()=>this.setState({
                                isCart: false,
                            })}/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px'/>
                    </div>
                    <hr/>
                    <div className="item">
                        <div className="item_title">
                            <h2>Item</h2>
                        </div>
                        <div className="item_amount_head">
                            <h2>Amount</h2>
                        </div>
                        <div className="item_total_cost">
                            <h2>Total Cost</h2>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        {this.renderItems()}
                    </div>
                    <div>
                        <button onClick={()=> this.setOrder()}>Order Items</button>
                    </div>
                </div>
            );
        }
        else if(this.state.isForm && !this.state.isThanks){
            return(
                <div className="Form_page">
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'
                            onClick={()=>this.setState({
                            isCart: false,
                            isForm: false,
                        })}/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px'
                            onClick={()=>this.setState({isForm: false})}/>
                    </div>
                    <hr/>
                    <div className="order_total">
                        <h2>Total price: {this.state.sum}€</h2>
                    </div>
                    <div className="Order_form">{this.renderForm()}</div>
                </div>
            );
        }else if(this.state.isThanks){
            return(
                <div className="Thanks_page">
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'
                            onClick={()=>this.setState({
                            isCart: false,
                            isForm: false,
                            isThanks: false,
                        })}/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px' 
                            onClick={()=>this.setState({
                                isForm: false,
                                isThanks: false
                            })}/>
                    </div>
                    <hr/>
                    <div className="Order_form">{this.renderThankYou()}</div>
                </div>
            )
        }
        else{
            return <div>Loading...</div>
        }
    }
}

export default Vsetky;