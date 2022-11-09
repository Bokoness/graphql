import Project from "../models/Project.js"
import Client from "../models/Client.js"

import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLEnumType,
	GraphQLNonNull,
	GraphQLList,
	GraphQLSchema,
} from "graphql"

//Client GraphQLObjectType
const ClientType = new GraphQLObjectType({
	name: "Client",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
})

//Project Type
const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		client: {
			//reference to client, this is the way to define relationship in graphql
			type: ClientType,
			resolve(parent, args) {
				return Client.findById(parent.clientId)
			},
		},
	}),
})

//Root Query - similar to the main router of the REST api, here we define all the data client can request
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
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
		projects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return Project.find()
			},
		},
		//to fetch a single client
		project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			//reslover is the function that handles that data that will be returned
			resolve(parent, args) {
				return Project.findById(args.id)
			},
		},
	},
})

//Mutations
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
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
		//Add a project
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLNonNull(GraphQLString) },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatus",
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
					defaultValue: "Not Started",
				},
				clientId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const project = new Project({
					name: args.name,
					description: args.description,
					status: args.status,
					clientId: args.clientId,
				})

				return project.save()
			},
		},
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Project.findByIdAndDelete(args.id)
			},
		},
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatusUpdate",
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
				},
			},
			resolve(parent, args) {
				return Project.findByIdAndUpdate(
					args.id,
					{
						name: args.name,
						description: args.description,
						status: args.status,
					},
					{ new: true }
				)
			},
		},
	},
})

export default new GraphQLSchema({
	query: RootQuery,
	mutation,
})
