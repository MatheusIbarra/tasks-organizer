import React, { useState } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom'

import { useTable } from '../../hooks/tables';
import { Table } from '../../services/types';
import { customStyles } from '../../utils/modalStyles';

import './styles.css';

const Dashboard: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [table, setTable] = useState(new Table());

    const history = useHistory();
    const { tables, handleUpdate } = useTable();

    //REDIRECT TO TABLE PAGE
    const handleSelect = (id: number) => {
        history.push(`/table/${id}`)
    }

    //HANDLE WITH EVENT ON THE TABLE, EXAMPLE UPDATE OR ADD A NEW
    const handleTableEvents = () => {
        let newList = [];
        if(table.id) {
            const tableIndex = tables.findIndex(e => e.id === table.id)
            tables[tableIndex].description = table.description;
            tables[tableIndex].title = table.title;
            newList = [...tables];
        } else {
            newList = [...tables, {...table, id: tables.length + 1}];
        }

        localStorage.setItem('@Post2BTables', JSON.stringify(newList));
        toggleModal();
        handleUpdate();
    }

    const handleDelete = (id: number) => {      
        //PUT TO STORAGE THE NEW TABLE VALUE, WITHOUT THE DELETED ONE  
        localStorage.setItem('@Post2BTables', JSON.stringify(tables.filter(e => e.id !== id)));
        handleUpdate();
    }

    const toggleModal = () => {
        if(modalVisible) {
            setTable(new Table());
        }
        setModalVisible(!modalVisible)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTable({...table, [name]: value})
    }
    
    return (
        <div className="dashboard-container">
             <Modal
                isOpen={modalVisible}
                onRequestClose={toggleModal}
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <form  style={{display: 'flex', flexDirection: 'column'}} onSubmit={(e) => {e.preventDefault(); handleTableEvents()}}>
                    <label>Titulo</label>
                    <input onChange={handleInputChange} name="title" maxLength={16} required value={table.title || ''}></input>
                    <label style={{marginTop: 20}}>Descrição</label>
                    <input onChange={handleInputChange} name="description" maxLength={100} required value={table.description || ''}></input>
                    <button style={{marginTop: 20, marginLeft: 'auto'}} type="submit" className="card-button">
                        Enviar
                    </button>
                </form>
            </Modal>
            <h1 style={{color: 'white', zIndex: 2}}>Selecione um quadro</h1>
            <div className="boards-container">
                <h1 style={{zIndex: 2, color: 'white', textAlign: 'center'}}>Quadros</h1>
                <div className="boards-list">
                    {tables.length < 1 && 
                        <div className="table-card" style={{marginBottom: 40}}>
                            <button onClick={toggleModal} className="card-button">
                                Criar novo
                            </button>
                        </div>
                    }
                    {tables.map((e, index) => (
                        <React.Fragment key={e.id}>
                            <div>
                                <div className="table-card">
                                    <div className="cards-text">
                                        <div className="card-title">
                                            {e.title}
                                        </div>
                                        <div className="card-description">
                                            {e.description}
                                        </div>
                                    </div>
                                    <button onClick={() => handleSelect(e.id)} className="card-button">
                                    Selecionar
                                    </button>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 10}}>
                                    <button onClick={() => handleDelete(e.id)} style={{background: 'red', padding: 10, borderRadius: 10}}>Excluir</button>
                                    <button onClick={() => {setTable(e); toggleModal()}} style={{background: 'orange', padding: 10, borderRadius: 10}}>Editar</button>
                                </div>
                            </div>
                            {tables[tables.length - 1] === e && tables.length < 5 &&
                                <div className="table-card" style={{marginBottom: 40}}>
                                    <button onClick={toggleModal} className="card-button">
                                        Criar novo
                                    </button>
                                </div>
                            }
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;