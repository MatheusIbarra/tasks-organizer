import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';
import { Table, Tag } from '../services/types';

interface TablesContextData {
  tables: Table[];
  tags: Tag[];
  handleUpdate(): void;
  handleUpdateTags(): void;
}

const TablesContext = createContext<TablesContextData>({} as TablesContextData);


//A GLOBAL STATE, TO MANIPULE ALL VALUES IN THE SYSTEM. EASILY TO USE, EASY TO IMPLEMENT
const TablesProvider: React.FC = ({ children }) => {
  const [ tables, setTables ] = useState<any[]>([]);
  const [ update, setUpdate ] = useState(0);
  const [ updateTags, setUpdateTags ] = useState(0);
  const [ tags, setTags ] = useState<Tag[]>([])

  const handleUpdate = () => {
    setUpdate(update + 1)
  }

  const handleUpdateTags = () => {
    setUpdateTags(updateTags + 1)
  }

  //TAKE TABLES FROM STORAGE
  useEffect(() => {
    const data = localStorage.getItem('@Post2BTables');
    
    if(data) {
      setTables(JSON.parse(data));
    }
  }, [update]);

  //TAKE TAGS FROM STORAGE
  useEffect(() => {
    const data = localStorage.getItem('@Post2BTags');
    if(data) {
      setTags(JSON.parse(data));
    }
  }, [updateTags])

  return (
    <TablesContext.Provider value={{ tables, handleUpdate, handleUpdateTags, tags }}>
      {children}
    </TablesContext.Provider>
  )
};

function useTable(): TablesContextData {
  const context = useContext(TablesContext);

  //ERROR TRATATIVE, IF DONT USE THIS HOOK WITH PROVIDER, THROW A ERROR
  if (!context) {
    throw new Error('useTables precisa ter o TablesProvider em volta das rotas.');
  }

  return context;
}

export { TablesProvider, useTable };
