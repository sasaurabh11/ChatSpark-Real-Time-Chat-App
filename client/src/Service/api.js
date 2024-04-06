import axios from 'axios'

const url = 'http://localhost:8000'

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
        // console.log(response)
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