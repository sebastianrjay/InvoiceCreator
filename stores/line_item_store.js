var React = require('react'), LineItem = require('../components/line_item.js');
var AppDispatcher = require('../dispatcher/app_dispatcher.js');
var EventEmitter = require('events').EventEmitter;

var _lineItems = [<LineItem key="1" index={ "1" } />], _totals = {},
    _idx = 1, CHANGE_EVENT = "change", _serverData = {}, _startedItems = 0;

var _addLineItem = function() {
  _idx++;
  _lineItems.push(<LineItem key={ _idx } index={ _idx }/>);
}

var _setTotal = function(data) {
  _totals[data.index] = data.total;
}

var _removeLastLineItem = function() {
  _idx--;
  _lineItems.pop();
}

window.LineItemStore = $.extend({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isInvoiceReadyForSave: function() {
    var itemsCompleted = Object.keys(LineItemStore.serverData()).length;
    var itemsStarted = Object.keys(_startedItems).length
    return itemsCompleted > 0 && itemsCompleted === itemsStarted;
  },

  isLineItemAddable: function() {
    var itemsCompleted = Object.keys(LineItemStore.serverData()).length;
    return itemsCompleted > 0 && itemsCompleted === _lineItems.length;
  },

  isLineItemCompleted(item) {
    var formData = item[Object.keys(item)[0]];
    return Object.keys(formData).filter(function(key) {
      return !!formData[key] === false;
    }).length === 0;
  },

  isLineItemStarted(item) {
    var formData = item[Object.keys(item)[0]];
    return Object.keys(formData).filter(function(key) {
      return !!formData[key] === false;
    }).length > 0;
  },

  lineItems: function() {
    return _lineItems.slice();
  },

  serverData: function() {
    return $.extend(true, {}, _serverData);
  },

  setServerData: function(lineItem) {
    // _serverData contains only completed items, ready to be saved via AJAX
    if(this.isLineItemCompleted(lineItem)) {
      for(var key in lineItem) _serverData[key] = lineItem[key];
    } else if(this.isLineItemStarted(lineItem)){
      for(var key in lineItem) _startedItems[key] = lineItem[key];
    } else {
      for(var key in lineItem) { if(_serverData[key]) delete _serverData[key]; }
      for(var key in lineItem) { if(_startedItems[key]) delete _startedItems[key]; }
    }
  },

  toPriceString: function(price) {
    return '$' + parseFloat(price.toString().split('$').reverse()[0]).toFixed(2);
  },

  total: function() {
    var total = 0;
    for(key in _totals) total += _totals[key];

    return (total > 0 ? this.toPriceString(total) : null);
  },

  dispatcherID: AppDispatcher.register(function (payload) {
      switch(payload.actionType) {
        case "LINE_ITEM_ADDED":
          _addLineItem();
          LineItemStore.emit(CHANGE_EVENT);
          break;
        case "LINE_ITEM_SAVED":
          LineItemStore.setServerData(payload.data);
          LineItemStore.emit(CHANGE_EVENT);
          break;
        case "LAST_LINE_ITEM_DELETED":
          _removeLastLineItem();
          LineItemStore.emit(CHANGE_EVENT);
          break;
        case "LINE_ITEM_TOTAL_CALCULATED":
          _setTotal(payload.data);
          LineItemStore.emit(CHANGE_EVENT);
          break;
      }

      return true;
    })
});

module.exports = LineItemStore;
