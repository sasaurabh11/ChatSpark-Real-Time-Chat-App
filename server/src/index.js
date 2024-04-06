import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 3000

connectDB()
.then( () => {
    app.listen(port, (req, res) => {
        console.log(`app listen at ${port}`);
    })
})

.catch((err) => {
    console.log("DB Connection Error in index !!!", err)
})

