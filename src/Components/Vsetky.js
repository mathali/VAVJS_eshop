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
        };
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
                image={product.image_src} />
        });
    }

    getCart(){
        fetch('/cart_data')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    items: data,
                    isCart: true,
                })
            });
    }


    renderItems(){
        return this.state.items.map((item,index)=>{
            return <Item
                key={index}
                title={item.title}
                amount={item.amount}
                total_cost={item.total_cost}/>
        });
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