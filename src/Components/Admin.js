import React from 'react';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: this.props.key,
            id: this.props.id,
            amount: this.props.amount,
            customerName: this.props.customerName,
            customerEmail: this.props.customerEmail,
            productName: this.props.productName,
            state: this.props.state,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({state: event.target.value});
        
        fetch('/update_state',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                state: event.target.value
            }),
            credentials: 'same-origin'
        });
    }

  render() {
    return (
      <div className="admin_div">
        <p>{this.state.key}</p>
        <p>{this.state.amount}</p>
        <p>{this.state.customerName}</p>
        <p>{this.state.customerEmail}</p>
        <p>{this.state.productName}</p>
        <select value={this.state.state} onChange={this.handleChange} name="State" id="dropdown">
            <option value="Awaiting payment">Awaiting payment</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
        </select>
        <hr/>
      </div>
    );
  }
}
export default Admin;