import React, { useState } from 'react';
import { SliderPicker  } from 'react-color';
import Modal from 'react-modal';

import { Tag } from '../../services/types';
import { useTable } from '../../hooks/tables';
import Header from '../../components/Header';

import '../Table/styles.css';
import { customStyles } from '../../utils/modalStyles';

const Tags: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tag, setTag] = useState(new Tag());

    const { tags, handleUpdateTags } = useTable();
    
    //GET THE TAGINDEX WHEN IS UPDATE
    const tagIndex = tags.findIndex(e => e.id === tag.id)

    //TOGGLE MODAL, IF CLOSE MODAL RESET INPUTS
    const toggleModal = () => {
        if(modalVisible) {
            setTag(new Tag());
        }
        setModalVisible(!modalVisible)
    }

    //TAKE EVENT AND DYNAMICALLY PUT THE VALUE IN OBJECT
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTag({...tag, [name]: value})
    }

    const handleSubmit = () => {
        //VERIFY EXIST TAG TO UPDATE OR CREATE NEW
        if(tag.id) {
            tags[tagIndex] = tag;
        } else {
            tags.push({...tag, id: tags.length + 1});
        }
        //SET THE TAG IN THE STORAGE
        localStorage.setItem('@Post2BTags', JSON.stringify(tags));
        handleUpdateTags();
        toggleModal();
    }

    const handleDelete = (id: number) => {
        //GET TAGINDEX TO DELETE THEN REMOVE FROM ARRAY AND PUSH TO STORAGE
        const deleteTagIndex = tags.findIndex(e => e.id === id)
        tags.splice(deleteTagIndex, 1)
        localStorage.setItem('@Post2BTags', JSON.stringify(tags));
        handleUpdateTags();
    }

    return (
        <div className="tasks-board-container" style={{marginTop: '2vh'}}>
            <Header/>
            <Modal
                isOpen={modalVisible}
                onRequestClose={toggleModal}
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <form  style={{display: 'flex', flexDirection: 'column'}} onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                    <label>Titulo</label>
                    <input onChange={handleInputChange} name="title" maxLength={12} required value={tag.title || ''}></input>
                    <label style={{marginTop: 20}}>Descrição</label>
                    <input onChange={handleInputChange} name="description" maxLength={100} required value={tag.description || ''}></input>
                    <label style={{marginTop: 20, marginBottom: 10}}>Cor</label>
                    <SliderPicker color={tag.backgroundColor} onChange={(e) => setTag({...tag, backgroundColor: e.hex})}/>
                    <button style={{marginTop: 20, marginLeft: 'auto'}} disabled={!!!tag.backgroundColor} type="submit" className="card-button">
                        Enviar
                    </button>
                </form>
            </Modal>
            <div className="task-board" style={{width: '30vw', maxWidth: 500}}>
                <div className="task-board-title">
                TAGS
                </div>
                <div style={{maxHeight: '80vh', overflowY: 'auto'}}>
                    {tags.map(e => (
                        <div key={e.id} className="card-container">
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <div className="card-tag" style={{backgroundColor: e.backgroundColor}}></div>
                                <button onClick={() => handleDelete(e.id)} style={{color: 'black'}}>Excluir</button>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <div className="card-title">{e.title}</div>
                                <button onClick={() => {setTag(e); toggleModal()}} style={{color: 'black'}}>Editar</button>
                            </div>
                            <div className="card-description">{e.description}</div>
                        </div>
                    ))}
                </div>
                <button onClick={toggleModal} className="add-button">
                    <i className="fas fa-plus"></i> Adicionar tag
                </button>
            </div>
        </div>
    );
}

export default Tags;