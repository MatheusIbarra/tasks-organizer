import React from 'react';
import { useHistory } from 'react-router-dom';

import  './styles.css';

const Header: React.FC = () => {
    const history = useHistory();
    return (
        <div className="header">
            <button onClick={() => history.push('/')} className="boards"><i className="fas fa-table" style={{marginRight: 10}}>
                </i> Quadros
            </button>
            <button onClick={() => history.push('/tags')} className="boards"><i className="fas fa-table" style={{marginRight: 10}}>
                </i> Tags
            </button>
        </div>
    );
}

export default Header;