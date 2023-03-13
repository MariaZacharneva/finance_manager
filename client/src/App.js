import {useState, useEffect} from 'react'
import Service from './services/service'
import logger from './utils/logger'

const App = () => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        Service.getAllMessages()
            .then(received_messages => {
                logger.logInfo(`Received ${received_messages.length} messages`)
                logger.logInfo(`Message example: ${JSON.stringify(received_messages[0])}`)
                setMessages(received_messages)
            })
    }, []);

    const addNewMessage = (event) => {
        event.preventDefault();
        Service.addMessage({text_message: newMessage}).then(sent_message => {
            logger.logInfo(`Adding message: ${JSON.stringify(sent_message)}`);
            setMessages(messages.concat(sent_message));
            setNewMessage('')
        })
    }

    const handleNewMessage = (event) => {
        setNewMessage(event.target.value)
    }

    return (
        <div>
            <h2>Initial state</h2>
            <form onSubmit={addNewMessage}>
                <input value={newMessage} onChange={handleNewMessage}/>
                <button type="submit">save</button>
            </form>
            {messages.map(msg => <div key={msg.id}>{msg.text_message}</div>)}
        </div>
    );
}

export default App;
