/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'

const NotFound: React.FC = () => {
    const history = useHistory();
    //WHEN NOT FOUND A PAGE, REDIRECT TO HOME
    useEffect(() => {
        history.push('/home')
    }, []);

    return <div />;
}

export default NotFound;