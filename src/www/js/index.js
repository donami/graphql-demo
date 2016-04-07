"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import WidgetList from './components/widget-list';
import WidgetForm from './components/widget-form';
import HomeRoute from './routes/home';
import NodeRoute from './routes/node';

// ReactDOM.render(
// 	<Relay.RootContainer
// 		Component={WidgetList}
// 		route={new HomeRoute()}
// 	/>, document.querySelector('main'));

ReactDOM.render(
	<Relay.RootContainer
		Component={WidgetForm}
		route={new NodeRoute({ nodeId: "V2lkZ2V0OjU2ZDcxZDZlZmUwOGYzMzUwM2FhZmM5Nw=="})}
	/>, document.querySelector('main'));
