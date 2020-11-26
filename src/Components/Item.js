import React from 'react';

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            amount: this.props.amount,
            cost: this.props.cost,
        };
    }

  decreaseAmount(){
      if(this.state.amount - 1 < 0) return;
      this.setState({
            title: this.props.title,
            amount: this.state.amount - 1,
      });
  }

  increaseAmount(){
      this.setState({
            title: this.props.title,
            amount: this.state.amount + 1,
      });
  }

  render() {
    return (
      <div className="item">
        <div className="item_title">
          <h3>{this.state.title}</h3>
        </div>
        <div className="item_decrease_amount"  onClick={()=>this.decreaseAmount()}>
            <button>-</button>
        </div>
        <div className="item_amount">
            <p>{this.state.amount}</p>
        </div>
        <div className="item_increase_amount" onClick={()=>this.increaseAmount()}>
            <button>+</button>
        </div>
        <div className="item_total_cost">
            <h3>{this.state.amount * this.state.cost}€</h3>
        </div>
        <div className="remove_item_btn">
            <button onClick={()=>this.props.unmountChild(this.state.title)}>X</button>
        </div>
      </div>
    );
  }
}
export default Item;