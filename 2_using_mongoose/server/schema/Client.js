import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
} from "graphql"
import Client from "../models/Client.js"

const ClientType = new GraphQLObjectType({
	name: "Client",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
})

const ClientQueries = {
	clients: {
		type: new GraphQLList(ClientType),
		resolve(parent, args) {
			return Client.find()
		},
	},
	//to fetch a single client
	client: {
		type: ClientType,
		args: { id: { type: GraphQLID } },
		//reslover is the function that handles that data that will be returned
		resolve(parent, args) {
			return Client.findById(args.id)
		},
	},
}

const ClientMutations = {
	addClient: {
		type: ClientType,
		args: {
			name: { type: GraphQLNonNull(GraphQLString) },
			email: { type: GraphQLNonNull(GraphQLString) },
			phone: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve(parent, args) {
			console.log(args)
			const client = new Client({
				name: args.name,
				email: args.email,
				phone: args.phone,
			})
			return client.save()
		},
	},
	//remove 1 client
	deleteClient: {
		type: ClientType,
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve(parent, args) {
			return Client.findByIdAndDelete(args.id)
		},
	},
}
export { ClientType, ClientQueries, ClientMutations }
