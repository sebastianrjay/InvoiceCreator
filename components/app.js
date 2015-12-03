var React = require('react');
var InvoiceCreator = require('./invoice_creator.js');
var LineItem = require('./line_item.js');

var App = React.createClass({

  createInvoice: function(event) {
    this.setState({ invoiceCreated: true });
  },

  getInitialState: function() {
    return { invoiceCreated: false };
  },

  render: function() {
    var content = (
      <section>
        <div className="col-lg-3"></div>
        <div className="col-lg-2">
          <button className="btn btn-lg btn-primary"
            onClick={ this.createInvoice }>Create Invoice</button>
        </div>
        <div className="col-lg-2"></div>
      </section>
    );

    if(this.state.invoiceCreated) {
      content = <InvoiceCreator />
    }

    return (
      <section>
        <section className="row">
          <div className="col-lg-12 top-spacing"></div>
        </section>
        <section className="row">
          <div className="col-lg-1"></div>
            { content }
          <div className="col-lg-2"></div>
        </section>
      </section>
    )
  }
});

module.exports = App;
