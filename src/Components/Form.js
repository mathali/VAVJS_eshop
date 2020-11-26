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

  render() {
    return (
      <div className="form_div">
        <form className="form">
            <label>Name</label><br/>
            <input type="text" id="name"/><br/>
            <label>Phone Number</label><br/>
            <input type="text" id="phone_no"/><br/>
            <label>Email</label><br/>
            <input type="text" id="email"/><br/>
            <label>Street</label><br/>
            <input type="text" id="street"/><br/>
            <label>City</label><br/>
            <input type="text" id="city"/><br/>
            <label>Country</label><br/>
            <input type="text" id="country"/><br/>
            <label>Postcode</label><br/>
            <input type="text" id="postcode"/><br/>
            <button>Order</button>
        </form>
      </div>
    );
  }
}
export default Form;