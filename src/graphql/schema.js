"use strict";

import {
	GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList,
	GraphQLID, GraphQLNonNull, GraphQLInputObjectType
} from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, connectionDefinitions, connectionArgs, connectionFromPromisedArray } from "graphql-relay";
import { getUser, getWidget, getWidgets } from "../database";
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

var inputWidgetType = new GraphQLInputObjectType({
	name: 'InputWidget',
	description: "A widget object",
	fields: () => ({
		id: globalIdField('Widget'),
		name: {
			type: new GraphQLNonNull(GraphQLString),
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
})

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
		deleteWidget: {
			// return value
			type: widgetType,
			// args
			args: {
				widgetId: globalIdField('Widget')
			},
			resolve: (obj, {widgetId}) => {
				var {type, id} = fromGlobalId(widgetId);
				console.log("type", type);
				console.log("id", id);
				return new Widget({ id: id });
			}
		},
		saveWidget: {
		  type: widgetType,
		  args: {
		    widget: {
		      description: 'The widget',
		      type: new GraphQLNonNull(inputWidgetType)
		    }
		  },
		  resolve: (obj, {widget}) => {
				var {type, id} = fromGlobalId(widget.id);
				console.log("type",  type);
				console.log("id",  id);
				return new Widget(widget);
		  }
		}
  })
});

export const Schema = new GraphQLSchema({ query: queryType, mutation: mutationType });
