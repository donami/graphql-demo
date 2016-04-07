import Relay from 'react-relay';

export default class SaveWidgetMutation extends Relay.Mutation {

	static fragments = {
    widget: () => Relay.QL`
      fragment on Widget {
        id,
      }
    `
  };

	getMutation() {
    return Relay.QL`mutation{saveWidget}`;
  }

	// getCollisionKey() {
  //   return `check_${this.props.widget.id}`;
  // }

	getFatQuery() {
    return Relay.QL`
      fragment on SaveWidgetPayload {
				widget {
	        id,
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
    return {
      widget: this.props.widget
    };
  }

  getOptimisticResponse() {
    return {
      widget: this.props.widget
    };
  }
}
