import './App.css';

import React, { useState } from 'react';
import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import LayoutFlow from './components/LayoutFlow';
import Legend from './components/Legend';
import Navbar from './components/Navbar';
import Toolbar from './components/Toolbar';

function App() {
  const [elements, setElements] = useState([]);
  const [json, setJson] = useState({});
  const [jsonMap, setJsonMap] = useState(new Map());
  const [error, setError] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [showNumCalls, setShowNumCalls] = useState(true);
  return (
    <>
      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        onChange={(index) => console.log(index)}
      >
        <Navbar
          setElements={setElements}
          setJson={setJson}
          setJsonMap={setJsonMap}
          showTime={showTime}
          showNumCalls={showNumCalls}
          setError={setError}
        />
        <TabPanels>
          <TabPanel>
            <Toolbar
              setElements={setElements}
              setShowTime={setShowTime}
              setShowNumCalls={setShowNumCalls}
              json={json}
              jsonMap={jsonMap}
              showTime={showTime}
              showNumCalls={showNumCalls}
              setJson={setJson}
            />
            <LayoutFlow
              elements={elements}
              setElements={setElements}
              error={error}
            />
            <Legend />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default App;
