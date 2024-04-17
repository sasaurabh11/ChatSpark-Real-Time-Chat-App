import { server } from "./app.js";
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 3000

const startServer = async () => {
    server.listen(port, () => {
      console.info(
        `✅ server is running at: http://localhost:${port}`  
      )
    })
  }

connectDB()
.then( () => {
    // app.listen(port, (req, res) => { //this will not work here,  as it creates a new HTTP server.
    //     console.log(`app listen at ${port}`);
    // })

    startServer()
})
.catch((err) => {
    console.log("DB Connection Error in index !!!", err)
})

