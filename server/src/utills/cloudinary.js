import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: process.env.COUDINARY_CLOUD_NAME, 
  api_key: process.env.COUDINARY_API_KEY, 
  api_secret: process.env.COUDINARY_SECRET_KEY 
});

const uploadOnCloudinary = async (localPath) => {
    try {
        if(!localPath) return null
        //upload on Cloudinary
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })
        // console.log("file uploaded on cloudinary", response.url);
        fs.unlinkSync(localPath)
        return response
    } catch (error) {
        fs.unlinkSync(localPath) //remove the locally saved file from temprary stored data
        return null;
    }
}

export { uploadOnCloudinary }