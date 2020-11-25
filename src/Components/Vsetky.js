import React, { useEffect, useState } from 'react';

import Product from './Product';

function Vsetky(props) {
    const [products, setProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

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

    if(isLoaded) {
        return (
            <div className = 'product_page'>
                <div className="home_btn">
                    <img src="https://img.icons8.com/metro/26/000000/home.png"  alt="Home" width='50px' height='50px' onClick={()=>{alert('test')}}/>
                </div>
                <div className="cart_btn">
                    <img src="https://img.icons8.com/ios-filled/50/000000/shopping-basket-2.png" alt="Cart" width='50px' height='50px' padding-left='50px'/>
                </div>
                <div>
                    {renderProducts()}
                </div>
            </div>
        );
    }
    else {
        return <div>Loading...</div>
    }
}

export default Vsetky;