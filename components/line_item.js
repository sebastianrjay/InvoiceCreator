var React = require('react');
var AppDispatcher = require('../dispatcher/app_dispatcher.js');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Products = require('../stores/product_store.js');

var LineItem = React.createClass({

  mixins: [LinkedStateMixin],

  addLineItem: function() {
    if(LineItemStore.isLineItemAddable() &&
        LineItemStore.isLineItemCompleted({ arbitraryKey: this.state })) {
      AppDispatcher.dispatch({
        actionType: "LINE_ITEM_ADDED"
      });
    }
  },

  calculateTotal: function() {
    if(this.state.price && this.state.quantity) {
      var total = Math.floor(parseFloat(this.state.price) * 100 *
        parseInt(this.state.quantity)) / 100;

      if(isNaN(total)) {
        return null;
      } else {
        AppDispatcher.dispatch({
          actionType: "LINE_ITEM_TOTAL_CALCULATED",
          data: { total: total, index: this.props.index }
        });

        return LineItemStore.toPriceString(total);
      }

    } else {
      AppDispatcher.dispatch({
        actionType: "LINE_ITEM_TOTAL_CALCULATED",
        data: { total: null, index: this.props.index }
      });
    }
  },

  componentDidMount: function() {
    LineItemStore.addChangeListener(this._onLineItemStoreChange);

    var productNames = Object.keys(Products);
    this.searchOptions = [];
    for(var i = 0; i < productNames.length; i++) {
      this.searchOptions.push(<option key={ i } value={ productNames[i] } />);
    }
  },

  getInitialState: function() {
    return { productName: null, quantity: null, price: null, total: null };
  },

  handleInput: function(e){
    this.setState({ total: this.calculateTotal() });
    this.saveData();

    if(e.target.value !== "") this.addLineItem();
  },

  isRemovable: function() {
    return this.props.index > 1 &&
      LineItemStore.lineItems().length === this.props.index;
  },

  _onLineItemStoreChange: function() {
    if(this.isMounted()) this.forceUpdate();
  },

  remove: function() {
    AppDispatcher.dispatch({
      actionType: "LAST_LINE_ITEM_DELETED"
    });
  },

  render: function() {
    var options = [], removeButton = "";
    for(var i = 1; i < 11; i++) options.push(<option key={ i } value={ i } />);
    if(this.isRemovable()) {
      removeButton = <p className="remove-line-item-button" onClick={ this.remove }>X</p>
    }

    return (
      <section className="row">
        <p className="col-lg-1 line-item-number">{ this.props.index })</p>
        <div>
          <input type="text" valueLink={ this.linkState('productName') }
            onKeyUp={ this.handleInput } onSelect={ this.handleInput }
            placeholder="Product Name" list="product-names" />
          <datalist id="product-names">
            { this.searchOptions }
          </datalist>
          <input type="text" valueLink={ this.linkState('price') }
            onKeyUp={ this.handleInput } placeholder="Price ($)" />
          <input type="text" valueLink={ this.linkState('quantity') }
            onSelect={ this.handleInput } onKeyUp={ this.handleInput }
            placeholder="Quantity" list="quantities" />
          <datalist id="quantities">
            { options }
          </datalist>
          <input type="text" valueLink={ this.linkState('total') }
            onKeyUp={ this.handleInput } placeholder="Total ($)" />
          { removeButton }
        </div>
      </section>
    )
  },

  saveData: function() {
    var payload = {};
    payload[this.props.index] = this.serverData();
    AppDispatcher.dispatch({
      actionType: "LINE_ITEM_SAVED",
      data: payload
    });
  },

  serverData: function() {
    return { price: this.state.price, productName: this.state.productName,
      quantity: this.state.quantity, total: this.state.total };
  }
})

module.exports = LineItem;
