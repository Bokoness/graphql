import express from "express"
import dotenv from "dotenv"
import { graphqlHTTP } from "express-graphql"
import schema from "./schema/schema.js"
import connectDB from "./config/db.js"

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

//Connect to database
connectDB()

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: process.env.NODE_ENV === "development",
	})
)

app.listen(port, console.log(`Server is running on port ${port}`))
