var getBabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../dist/graphql/schema.json');
module.exports = getBabelRelayPlugin(schema.data);
