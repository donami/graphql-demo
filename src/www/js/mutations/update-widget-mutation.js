import Relay from 'react-relay';

export default class UpdateWidgetMutation extends Relay.Mutation {

	static fragments = {
    widget: () => Relay.QL`fragment on Widget { id }`
  };

	getMutation() {
    return Relay.QL`mutation{updateWidget}`;
  }

	getFatQuery() {
    return Relay.QL`
      fragment on UpdateWidgetPayload {
				widget {
					name,
					description,
					color,
					size,
					quantity
				}
      }
    `;
  }

	getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        widget: this.props.widget.id,
      },
    }];
  }

	getVariables() {
    return { widget: {
			id: this.props.widget.id,
			name: this.props.name,
			description: this.props.description,
			color: this.props.color,
			size: this.props.size,
			quantity: this.props.quantity,
    } };
  }

	getOptimisticResponse() {
		return {
			id: this.props.widget.id,
			name: this.props.name,
			description: this.props.description,
			color: this.props.color,
			size: this.props.size,
			quantity: this.props.quantity,
    };
	}
}
