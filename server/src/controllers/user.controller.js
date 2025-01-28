
import { User } from "../model/user.model.js";

export const addUser = async (req, res) => {
    try {
        let existedUser = await User.findOne({sub : req.body.sub})

        if(existedUser) {
            res.status(200)
            .json({
                message : 'user already exist'
            })

            return;
        }

        const newUser = new User(req.body)
        await newUser.save()

        return res.status(200)
        .json({
            message: 'user created successfully'
        })
    } catch (error) {
        console.error('Error occurred while adding user:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
    // res.send("Landing page of home")
};

export const getUser = async (req, res) => {
    try {
        
        const allUsers = await User.find({})

        return res.status(200)
        .json(allUsers)

    } catch (error) {
        console.error('Error occurred while getUser from database user:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}