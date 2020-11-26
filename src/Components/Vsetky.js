import React, { useEffect, useState } from 'react';

import Product from './Product';
import Item from './Item';

class Vsetky extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            isLoaded: false,
            items: [],
            isCart: false,
            dontRender: [],
        };
        this.unmountChild = this.unmountChild.bind(this);
        this.remountChild = this.remountChild.bind(this);
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
                unmountChild={this.unmountChild}/>
        });
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

    remountChild(title){
        console.log(title);
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

    render(){
        if(!this.state.isLoaded)this.getProducts();
        if(this.state.isLoaded && !this.state.isCart) {
            return (
                <div className = 'product_page'>
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px' padding-left='50px' 
                        onClick={()=>this.getCart()}/>
                    </div>
                    <div>
                        {this.renderProducts()}
                    </div>
                </div>
            );
        }
        else if (this.state.isCart){
            return (
                <div className = 'cart_page'>
                    <div className="home_btn">
                        <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'
                            onClick={()=>this.setState({
                                isCart: false,
                            })}/>
                    </div>
                    <div className="cart_btn">
                        <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px' padding-left='50px'/>
                    </div>
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
                        <button>Order Items</button>
                    </div>
                </div>
            );
        }
        else{
            return <div>Loading...</div>
        }
    }
}

export default Vsetky;