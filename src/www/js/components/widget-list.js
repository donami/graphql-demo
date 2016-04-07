import React from 'react';
import Relay from 'react-relay';

class WidgetList extends React.Component {

  render() {

    return <table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Color</th>
					<th>Size</th>
					<th>Quantity</th>
				</tr>
			</thead>
			<tbody>
				{this.props.user.widgets.edges.map(edge => {
					return <tr key={edge.node.id}>
						<td>{edge.node.name}</td>
						<td>{edge.node.color}</td>
						<td>{edge.node.size}</td>
						<td>{edge.node.quantity}</td>
					</tr>;
				})}
			</tbody>
    </table>;

  }
}

export default Relay.createContainer(WidgetList, {
  fragments: {
    user: () => Relay.QL`
			fragment on User {
				widgets(first: 10) {
          edges {
            node {
              id,
              name,
							color,
							size,
							quantity
            },
          },
        },
			}
    `,
  },
});
