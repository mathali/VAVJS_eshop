// Matej Halinkovic
import React from 'react';

// Admin interface
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

    // Detected changed state in dropdown and immediately update the database
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
            <hr/><br/>
            <div  className="order_id">
                <p>{this.state.id}</p>
            </div>
            <div className="order_amount"> 
                <p>{this.state.amount}</p>
            </div>
            <div className="order_cname">
                <p>{this.state.customerName}</p>
            </div>
            <div className="order_email">
                <p>{this.state.customerEmail}</p>
            </div>
            <div  className="order_pname">
                <p>{this.state.productName}</p>
            </div>
            <div  className="order_state" >
                <select value={this.state.state} onChange={this.handleChange} id="dropdown">
                    <option value="Awaiting payment">Awaiting payment</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                </select>
            </div>
      </div>
    );
  }
}
export default Admin;