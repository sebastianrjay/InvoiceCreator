var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/app');

$(function() {
  var app = React.createElement(App, {});
  ReactDOM.render(app, document.getElementById('content'));
});
