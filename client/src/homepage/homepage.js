import {useEffect} from "react";

const HomePage = ({changeTab}) => {
    useEffect(() => {
        changeTab('home');
    }, [changeTab]);

    return (<h1>Welcome to our Finance helper!</h1>)
}

export default HomePage;