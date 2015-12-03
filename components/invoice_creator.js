var React = require('react'), LineItem = require('./line_item.js');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var AppDispatcher = require('../dispatcher/app_dispatcher.js');
var LineItemStore = require('../stores/line_item_store.js');

var InvoiceCreator = React.createClass({

  mixins: [LinkedStateMixin],

  addLineItem: function() {
    AppDispatcher.dispatch({
      actionType: "LINE_ITEM_ADDED"
    });
  },

  componentDidMount: function() {
    LineItemStore.addChangeListener(this._onLineItemStoreChange);
  },

  getInitialState: function() {
    return { total: "", customerName: "", date: "",
      lineItems: LineItemStore.lineItems(), invoiceNumber: "" };
  },

  _onLineItemStoreChange: function() {
    this.setState({ lineItems: LineItemStore.lineItems(),
      total: LineItemStore.total() });
  },

  saveFormData: function() {
    // Call the appropriate function in api_actions.js here, making an AJAX POST
    // request with data stored in LineItemStore.serverData()
  },

  render: function() {
    return (
      <div className="col-lg-9">
        <h1 id="invoice-header">New Invoice</h1>
        <br />
        <div className="invoice-container">
          <form>
            <br />
            <h2 id="item-header">Info:</h2>
            <br />
            <input type="text" valueLink={ this.linkState('customerName') }
              placeholder="Customer Name" />
            <input type="date" valueLink={ this.linkState('date') } />
            <input type="text" valueLink={ this.linkState('invoiceNumber') }
              placeholder="Invoice Number" />
            <br /><br /><br />
            <h2 id="item-header">Items:</h2>
            <br />
            { this.state.lineItems }
          </form>
          <br />
          <div className="col-lg-1"></div>
          <div>
            <p className="add-line-item-button" onClick={ this.addLineItem }>+</p>
            <br /><br /><br />
            <input type="text" valueLink={ this.linkState('total') }
              className="total" placeholder="Grand Total ($)" />
            <br /><br /><br />
            <button className="save-button btn btn-lg btn-primary"
              onClick={ this.saveFormData }>Save Invoice</button>
            <br /><br /><br />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = InvoiceCreator;
