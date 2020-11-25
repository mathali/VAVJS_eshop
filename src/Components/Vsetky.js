import React, { useEffect, useState } from 'react';

import Product from './Product';
import Item from './Item';

function Vsetky(props) {
    const [products, setProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const [items, setItems] = useState([]);
    const [isCart, setIsCart] = useState(false);

    useEffect(()=>{
        fetch('/product_data')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setIsLoaded(true);
            });
    },[]);

    function renderProducts() {
        return products.map((product,index)=>{
            return <Product
                key={product.id}
                title={product.name}
                cost={product.cost}
                image={product.image_src} />
        });
    }

    function getCart(){
        fetch('/cart_data')
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setIsCart(true);
            });
    }


    function renderItems(){
        return items.map((item,index)=>{
            return <Item
                key={index}
                title={item.title}
                amount={item.amount}
                total_cost={item.total_cost}/>
        });
    }

    if(isLoaded && !isCart) {
        return (
            <div className = 'product_page'>
                <div className="home_btn">
                    <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'/>
                </div>
                <div className="cart_btn">
                    <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px' padding-left='50px' 
                    onClick={()=>getCart()}/>
                </div>
                <div>
                    {renderProducts()}
                </div>
            </div>
        );
    }
    else if (isCart){
        return (
            <div className = 'cart_page'>
                <div className="home_btn">
                    <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px'onClick={()=>setIsCart(false)}/>
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
                    {renderItems()}
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

export default Vsetky;