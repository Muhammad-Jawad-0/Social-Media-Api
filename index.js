import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./routes/users.js"
import authRoute from "./routes/auth.js"
import postRoute from "./routes/Posts.js"

const app = express();
dotenv.config();

// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@socailmediacluster.zcavh7i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=SocailMediaCluster`)
mongoose.connect(process.env.DB_URL) // ye bhi kr sakhte ha

mongoose.connection.on("connected", () => {
    console.log(" ----- connected mongodb -----")
})

//middleware

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)

app.listen(5000, () => {
    console.log("Backend Server Is Running!...")
})