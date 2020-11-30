import React from 'react';

// Homepage product display
class Product extends React.Component {
  render() {
    return (
      <div className="product">
        <div className="h1">
          <h1>{this.props.title}</h1>
        </div>
        <div className="h2">
          <h2>{this.props.cost}€</h2>
        </div>
        <div className="image">
          <img src={this.props.image} alt="failed to load" width='300px' height='300px'></img>
        </div>
        <div className="buy_btn">
          <button id={this.props.title} onClick={()=> this.handleClick(this.props.title)}>Add to cart</button>
        </div>
      </div>
    );
  }

  // Add chosen product to the cart of your session
  handleClick(title) {
    this.props.remount(title);
    fetch('/to_cart',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: title}),
          credentials: 'same-origin'
      });
  }
}
export default Product;