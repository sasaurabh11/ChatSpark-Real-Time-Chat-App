import axios from 'axios'

const url = 'https://chatspark-real-time-chat-app-api.onrender.com'
// const url = 'http://localhost:8000'

export const addUser = async (data) => {
    try {
        await axios.post(`${url}/api/v1/user/postuser`, data);

    } catch (error) {
        console.error('error in addUser API', error.message)
    }
}

export const getUser = async() => {
    try {
        let response = await axios.get(`${url}/api/v1/user/getuser`);
        return response.data;
    } catch (error) {
        console.error('error while calling getuser api', error.message)
    }
}

export const setConversation = async (data) => {
    try {
        await axios.post(`${url}/api/v1/user/conversation/add`, data); 
    } catch (error) {
        console.error('error while calling set conversation  api', error.message)
    }
}

export const getConversation = async(data) => {
    try {
        let response = await axios.post(`${url}/api/v1/user/conversation/get`, data);
        return response.data;
    } catch (error) {
        console.error('error while calling getconversation  api', error.message)
    }
}

export const newMassage = async(data) => {
    try {
        await axios.post(`${url}/api/v1/user/message/add`, data)
 
    } catch (error) {
        console.error('error while calling getconversation  api', error.message)
    }
}

export const getMessage = async(id) => {
    try {
        let response = await axios.get(`${url}/api/v1/user/message/get/${id}`);
        return response.data;
    } catch (error) {
        console.error('error while calling getmessage api', error.message)
    }
}

export const uploadFile = async (data) => {
    try {
        return await axios.post(`${url}/api/v1/user/file/upload`, data)
    } catch (error) {
        console.error('error while calling uploadFile  api', error.message)
    }
}

export const signupLocal = async (formData) => {
    try {
        const response = await axios.post(`${url}/api/v1/user/signuplocal`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;

    } catch (error) {
        console.error('error in signUpLocal API', error.message)
    }
}

export const loginLocal = async (data) => {
    try {
        let response = await axios.post(`${url}/api/v1/user/loginlocal`, data);
        return response.data;
    } catch (error) {
        console.error('error while calling getuser api', error.message)
    }
}

export const getInfoLocalAccount = async () => {
    try {
        let response = await axios.get(`${url}/api/v1/user/getalluserlocal`);
        return response.data;
    } catch (error) {
        console.error('error while calling getuser api', error.message)
    }
}

export const sendrequestforFriend = async (data) => {
    try {
        let response = await axios.post(`${url}/api/v1/user/friend-request`, data);
    } catch (error) {
        console.error('error while calling sendfriendRequest api', error.message)
    }
}

export const acceptanceforfriendShip = async (data) => {
    try {
        let response = await axios.post(`${url}/api/v1/user/accept-friend-request`, data);
    } catch (error) {
        console.error('error while calling acceptanceforfriendShip api', error.message)
    }
}

export const fetchAllRequests = async (requestId) => {
    try {
        let response = await axios.get(`${url}/api/v1/user/get-friend-request/${requestId}`);
        return response.data;
    } catch (error) {
        console.error('error while calling fetchAllRequests api', error.message);
        throw error;
    }
};

export const getFriendsDetails = async (requestId) => {
    try {
        let response = await axios.get(`${url}/api/v1/user/get-all-friends`, {
            params: { requestId }
        });
        return response.data.friendships
    } catch (error) {
        console.error('error while calling getFriendsDetails api', error.message);
        throw error;
    }
}
