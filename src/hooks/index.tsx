import React from 'react';

import { TablesProvider } from './tables';

const AppProvider: React.FC = ({ children }) => (
    <TablesProvider>
        {children}
    </TablesProvider>
);

export default AppProvider;
