/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useEffect } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Header from '../../components/Header';
import { Table, Task } from '../../services/types';
import { useTable } from '../../hooks/tables';
import { customStyles } from '../../utils/modalStyles';

import './styles.css'


const Boards: React.FC = (route: any) => {
    const [table, setTable] = useState(new Table());
    const [task, setTask] = useState(new Task());
    const [modalVisible, setModalVisible] = useState(false);
    const [process, setProcess] = useState(1 | 2 | 3);

    const history = useHistory();
    const { tables, handleUpdate, tags } = useTable();

    let tableIndex = tables.findIndex(e => e.id === Number(route.match.params.id));

    const toggleModal = (process: number) => {
        if(modalVisible) {
            setTask(new Task());
        }
        setProcess(process);
        setModalVisible(!modalVisible)
    }
    
    //TAKE EVENT AND DYNAMICALLY PUT THE VALUE IN OBJECT
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTask({...task, [name]: value})
    }

    const handleSubmit = () => {
        //CHECK IF TASK HAVE ID, IF HAVE IT, UPDATE, ELSE CREATE A NEW
        if(task.id) {
            const taskIndex = tables[tableIndex]?.tasks?.findIndex(e => e.id === task.id)
            tables[tableIndex].tasks[taskIndex] = task
        } else {
            if(table.tasks && table.tasks.length > 0) {
                tables[tableIndex] = {...table, tasks: [...table.tasks, {...task, 
                    id: Math.random().toString(36).substr(2, 9),
                    process: process,
                    table: table.id,
                    tag: task.tag
                }]}
            } else {
                tables[tableIndex] = {...table, tasks: [{...task, 
                    id: Math.random().toString(36).substr(2, 9),
                    process: process,
                    table: table.id,
                    tag: task.tag
                }]}
            }
        }
        toggleModal(0);
        localStorage.setItem('@Post2BTables', JSON.stringify(tables));
        handleUpdate();
    }

    const handleDelete = (id: string) => {
        //GET THE TASK INDEX IN TABLE, THEN SREMOVE IT AND PUSH TO STORAGE
        let taskIndex = table?.tasks?.findIndex(e => e.id === id);
        tables[tableIndex]?.tasks?.splice(taskIndex ? taskIndex : 0, 1);
        localStorage.setItem('@Post2BTables', JSON.stringify(tables));
        handleUpdate();
    }

    useEffect(() => {
        //PREVENT ERROR, IF DONT HAVE THE SELECTED TABLE, JUST REDIRECT TO HOME.
        if(tableIndex >= 0) {
            setTable(tables[tableIndex]);
        } else {
            history.push('/home')
        }
    }, [tableIndex, tables]);

    return (
        <>
            <div className="global-container">
                <Modal
                    isOpen={modalVisible}
                    onRequestClose={() => toggleModal(0)}
                    shouldCloseOnOverlayClick={true}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <form  style={{display: 'flex', flexDirection: 'column'}} onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                        <label>Titulo</label>
                        <input onChange={handleInputChange} name="title" maxLength={16} required value={task.title || ''}></input>
                        <label style={{marginTop: 20}}>Descrição</label>
                        <input onChange={handleInputChange} name="description" maxLength={100} required value={task.description || ''}></input>
                        <label style={{marginTop: 20}}>TAG</label>
                        <select value={JSON.stringify(task.tag)} onChange={(e) => setTask({...task, tag: JSON.parse(e.target.value)})}>
                            <option>Selecione</option>
                            {tags.map(e => (
                                <option key={e.id} value={JSON.stringify(e)} style={{background: e.backgroundColor}}>{e.title}</option>
                            ))}
                        </select>
                        {task.id &&
                            <>
                                <label style={{marginTop: 20}}>Mover</label>
                                <select onChange={(e) => setTask({...task, process: Number(e.target.value)})} name="process" required value={task.process || ''}>
                                    <option value={1}>
                                        TODO
                                    </option>
                                    <option value={2}>
                                        DOING
                                    </option>
                                    <option value={3}>
                                        DONE
                                    </option>
                                </select>
                            </>
                        }
                        <button style={{marginTop: 20, marginLeft: 'auto'}} type="submit" className="card-button">
                            Enviar
                        </button>
                    </form>
                </Modal>
                <Header/>
                <div className="tasks-board-container" style={{marginTop: '2vh'}}>
                    <div className="task-board">
                        <div className="task-board-title">
                        TO DO
                        </div>
                        <div style={{maxHeight: '80vh', overflowY: 'auto'}}>
                            {table?.tasks?.filter(e => e.process === 1)?.map(e => (
                                <div className="card-container">
                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                        <div data-tip={e.tag?.description} className="card-tag" style={{backgroundColor: e.tag?.backgroundColor}}>{e.tag?.title}</div>
                                        <button onClick={() => handleDelete(e.id)} style={{color: 'black'}}>Excluir</button>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                        <div className="card-title">{e.title}</div>
                                        <button onClick={() => {toggleModal(e.process); setTask(e)}} style={{color: 'black'}}>Editar</button>
                                    </div>
                                    <div className="card-description">{e.description}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => toggleModal(1)} className="add-button">
                            <i className="fas fa-plus"></i> Adicionar cartão
                        </button>
                    </div>
                    <div className="task-board">
                        <div className="task-board-title">
                        DOING
                        </div>
                        <div style={{maxHeight: '80vh', overflowY: 'auto'}}>
                            {table?.tasks?.filter(e => e.process === 2)?.map(e => {
                                return (
                                    <div className="card-container">
                                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                            <div data-tip={e.tag?.description} className="card-tag" style={{backgroundColor: e.tag?.backgroundColor}}>{e.title}</div>
                                            <button onClick={() => handleDelete(e.id)} style={{color: 'black'}}>Excluir</button>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                            <div className="card-title">{e.title}</div>
                                            <button onClick={() => {toggleModal(e.process); setTask(e)}} style={{color: 'black'}}>Editar</button>
                                        </div>
                                        <div className="card-description">{e.description}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <button onClick={() => toggleModal(2)} className="add-button">
                        <i className="fas fa-plus"></i> Adicionar cartão
                        </button>
                    </div>
                    <div className="task-board">
                        <div className="task-board-title">
                            DONE
                        </div>
                        <div style={{maxHeight: '80vh', overflowY: 'auto'}}>
                            {table?.tasks?.filter(e => e.process === 3)?.map(e => (
                                <div className="card-container">
                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                        <div data-tip={e.tag?.description} className="card-tag" style={{backgroundColor: e.tag?.backgroundColor}}>{e.title}</div>
                                        <button onClick={() => handleDelete(e.id)} style={{color: 'black'}}>Excluir</button>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                        <div className="card-title">{e.title}</div>
                                        <button  onClick={() => {toggleModal(e.process); setTask(e)}} style={{color: 'black'}}>Editar</button>
                                    </div>
                                    <div className="card-description">{e.description}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => toggleModal(3)} className="add-button">
                            <i className="fas fa-plus"></i> Adicionar cartão
                        </button>
                    </div>
                </div>
            </div>
        <ReactTooltip/>

        </>
    );
}

export default Boards;