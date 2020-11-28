import React from 'react';

class Thank_you extends React.Component {
    constructor(props) {
        super(props);
        /*this.state = {
            title: this.props.title,
            amount: this.props.amount,
            cost: this.props.cost,
        };*/
    } 

    loadPage(){
        fetch('/update_counter',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                message: "update",
            }),
          credentials: 'same-origin'
        });
        window.location.href = "https://www.fiit.stuba.sk";
    }

  render() {
    return (
        <div className="thanks_page">
            <div className="thanks_div">
                <h1>Thanks for your order!</h1>
            </div>
            <div className="banner_div">
                    <img src="https://www.ucn.sk/files/social/4645/stuFIIT.png" width='600px' height='400px' alt="FIIT STUBA" onClick={()=>this.loadPage()}/>
            </div>
        </div>
    );
  }
}
export default Thank_you;