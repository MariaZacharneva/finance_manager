import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'

const getAllMessages = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addMessage = (new_message) => {
    const request = axios.post(`${baseUrl}/new_message`, new_message);
    return request.then(response => response.data);
}
export default {getAllMessages, addMessage}
