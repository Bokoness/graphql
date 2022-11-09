import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType,
} from "graphql"
import Client from "../models/Client.js"
import Project from "../models/Project.js"
import { ClientType } from "./Client.js"

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

const ProjectQueries = {
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
}

const ProjectMutations = {
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
}

export { ProjectType, ProjectQueries, ProjectMutations }
