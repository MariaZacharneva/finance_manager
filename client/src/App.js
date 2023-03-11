import {useState} from 'react'
import Service from './services/service'

const App = () => {
    const [message, setMessage] = useState('')
    const getMessage = (event) => {
        Service.getAll().then(newMessage => {
            setMessage(newMessage);
        })
    }
    return (
        <div>
            <h2>Initial state</h2>
            <button onClick={getMessage}> Get message from server</button>
            <div>{message}</div>
        </div>
    );
}

export default App;
