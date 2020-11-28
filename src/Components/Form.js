import React from 'react';

class Form extends React.Component {
    constructor(props) {
        super(props);
        /*this.state = {
            title: this.props.title,
            amount: this.props.amount,
            cost: this.props.cost,
        };*/
    }

  createOrder(){
    var customer = {
        name: document.getElementById("name").value,
        phone_no: document.getElementById("phone_no").value,
        email: document.getElementById("email").value,
        street: document.getElementById("street").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
        postcode: document.getElementById("postcode").value
    };

    this.props.createOrder(customer);
  }  

  render() {
    return (
      <div className="form_div">
        <form className="form">
            <h2>Personal Information</h2><hr/>
            <label className='label'>Name</label><br/>
            <input className='form_text' type="text" id="name"/><br/>
            <label className='label'>Phone Number</label><br/>
            <input className='form_text' type="text" id="phone_no"/><br/>
            <label className='label'>Email</label><br/>
            <input className='form_text' type="text" id="email"/><br/>
            <h2>Delivery Information</h2><hr/>
            <label className='label'>Street</label><br/>
            <input className='form_text' type="text" id="street"/><br/>
            <label className='label'>City</label><br/>
            <input className='form_text' type="text" id="city"/><br/>
            <label className='label'>Country</label><br/>
            <input className='form_text' type="text" id="country"/><br/>
            <label className='label'>Postcode</label><br/>
            <input className='form_text' type="text" id="postcode"/><br/>
        </form>
        <div className="create_order_btn">
            <button className="create_btn" id="create_btn" onClick={()=>this.createOrder()}>Order</button>
        </div>
      </div>
    );
  }
}
export default Form;