import { ClientQueries, ClientMutations } from "./Client.js"
import { ProjectQueries, ProjectMutations } from "./Project.js"

import { GraphQLObjectType, GraphQLSchema } from "graphql"

//Root Query - similar to the main router of the REST api, here we define all the data client can request
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		...ClientQueries,
		...ProjectQueries,
	},
})

//Mutations
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		...ClientMutations,
		...ProjectMutations,
	},
})

export default new GraphQLSchema({
	query: RootQuery,
	mutation,
})
