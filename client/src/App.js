import { Center, Heading } from '@chakra-ui/react';
import React from 'react';
import MenuTable from './MenuTable';

function App() {
  return (
    <div className="App">
      <Center><Heading>Editable Table App</Heading></Center>
      <MenuTable />
    </div>
  );
}

export default App;
