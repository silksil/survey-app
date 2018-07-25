import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="Emaily"
        description="$5 for 5 email credits"
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="btn">
          Add Credits
        </button>
      </StripeCheckout>
      /* amount: here you can define the amount of money you request. The default is U.S. Dollars in cents
         token: is expecting to receive a callback function, which is called after we succesfully received an authorization token */
    );
  }
}

export default connect(null, actions)(Payments);
