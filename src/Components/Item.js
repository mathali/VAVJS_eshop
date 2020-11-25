import React from 'react';

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            amount: this.props.amount,
            total_cost: this.props.total_cost,
        };
    }

  decreaseAmount(){
      if(this.state.amount - 1 < 0) return;
      this.setState({
            title: this.props.title,
            //total_cost: (this.state.total_cost/this.state.amount) * (this.state.amount-1),
            amount: this.state.amount - 1,
      });
      /*this.state.total_cost = this.state.total_cost/this.state.amount * (this.state.amount-1);
      this.state.amount -= 1;
      this.render();*/
  }

  increaseAmount(){
      this.setState({
            title: this.props.title,
            //total_cost:( this.state.total_cost/this.state.amount) * (this.state.amount+1),
            amount: this.state.amount + 1,
      });
      /*this.state.total_cost = this.state.total_cost/this.state.amount * (this.state.amount+1);
      this.state.amount += 1;
      this.render();*/
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
            <h3>{this.state.amount * this.state.total_cost}€</h3>
        </div>
        <div className="remove_item_btn">
            <button onClick={()=>this.props.unmountChild(this.state.title)}>X</button>
        </div>
      </div>
    );
  }
}
export default Item;