"use strict";

import {
	GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList,
	GraphQLID, GraphQLNonNull, GraphQLInputObjectType
} from 'graphql';
import {
	globalIdField, nodeDefinitions, fromGlobalId, connectionDefinitions,
	connectionArgs, connectionFromPromisedArray, mutationWithClientMutationId } from "graphql-relay";
import { getUser, getWidget, getWidgets, updateWidget } from "../database";
import User from "../models/user";
import Widget from "../models/widget";

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
		var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else {
      return null;
    }
  }
);

const userType = new GraphQLObjectType({
	name: 'User',
	description: 'A user object',
	fields: () => ({
		id: globalIdField('User'),
		widgets: {
			type: widgetConnection,
			description: 'A user\'s widgets',
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(getWidgets(args), args)
		}
	}),
	interfaces: [nodeInterface]
});

const widgetType = new GraphQLObjectType({
	name: 'Widget',
	description: "A widget object",
	fields: () => ({
		id: globalIdField('Widget'),
		name: {
			type: GraphQLString,
			description: "The name of a widget",
		},
		description: {
			type: GraphQLString,
			description: "The description of a widget"
		},
		color: {
			type: GraphQLString,
			description: "The color of a widget"
		},
		size: {
			type: GraphQLString,
			description: "The size of a widget"
		},
		quantity: {
			type: GraphQLInt,
			description: "The quantity of a widget"
		}
	}),
	interfaces: [nodeInterface]
});

var { connectionType: widgetConnection } = connectionDefinitions({name: 'Widget', nodeType: widgetType});

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		node: nodeField,
		user: {
			type: userType,
			resolve: () => getUser(1)
		}
	})
});

var widgetTypeInput = new GraphQLInputObjectType({
	name: 'WidgetInput',
	description: "An update input widget object",
	fields: () => ({
		id: {
			type: GraphQLID,
			description: "The id of a widget",
		},
		name: {
			type: GraphQLString,
			description: "The name of a widget",
		},
		description: {
			type: GraphQLString,
			description: "The description of a widget"
		},
		color: {
			type: GraphQLString,
			description: "The color of a widget"
		},
		size: {
			type: GraphQLString,
			description: "The size of a widget"
		},
		quantity: {
			type: GraphQLInt,
			description: "The quantity of a widget"
		}
	})
});

var GraphQLUpdateWidgetMutation = mutationWithClientMutationId({
	name: 'UpdateWidget',
	inputFields: {
		widget: { type: widgetTypeInput }
	},
	outputFields: {
		widget: {
			type: widgetType,
			resolve: (widget) => {
				console.dir(widget);
				var {type, id} = fromGlobalId(widget.id);
				return new Widget(widget);
			}
		}
	},
	mutateAndGetPayload: ({widget}) => {
		widget._id = fromGlobalId(widget.id).id;
		return updateWidget(widget).catch(err => console.log(err));
	}
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
		updateWidget: GraphQLUpdateWidgetMutation
	})
});

export const Schema = new GraphQLSchema({ query: queryType, mutation: mutationType });
