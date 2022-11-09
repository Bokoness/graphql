import mongoose from "mongoose"
import colors from "colors"

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		dbName: process.env.DB_NAME,
	})
	console.log(colors.bgCyan(`MongoDB Connected: ${conn.connection.host}`))
}

export default connectDB
