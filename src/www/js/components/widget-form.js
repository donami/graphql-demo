"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class WidgetForm extends React.Component {

	constructor(props) {
		super();
		this.state = {
			widget: props.node
		};
		this.onChange = this.onChange.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	onChange(e) {
		this.setState({
			widget: Object.assign({}, this.state.widget, { [e.target.name]: e.target.value })
		});
	}

	onClick() {
		this.relay.
		console.dir(this.state.widget);
	}

	render() {
		return <form>
			<div>
				<label>
					Name: <input type="text" name="name" value={this.state.widget.name} onChange={this.onChange} />
				</label>
			</div>
			<div>
				<label>
					Description: <textarea name="description" value={this.state.widget.description} onChange={this.onChange}></textarea>
				</label>
			</div>
			<div>
				<label>
					Color: <select name="color" value={this.state.widget.color} onChange={this.onChange}>
						<option value="">Select One...</option>
						<option value="red">Red</option>
						<option value="blue">Blue</option>
						<option value="green">Green</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Size: <select name="size" value={this.state.widget.size} onChange={this.onChange}>
						<option value="">Select One...</option>
						<option value="small">Small</option>
						<option value="medium">Medium</option>
						<option value="large">Large</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Quantity: <input type="number" name="quantity" value={this.state.widget.quantity} onChange={this.onChange} />
				</label>
			</div>
			<button type="button" onClick={this.onClick}>Save</button>
		</form>;
	}
}


export default Relay.createContainer(WidgetForm, {
  fragments: {
    node: () => Relay.QL`
			fragment on Widget {
				id,
				name,
				description,
				color,
				size,
				quantity
			}
    `,
  },
});
