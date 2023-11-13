// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormEditor from './pages/FormEditor';
import FormPreview from './pages/FormPreview';
import "./styles/tailwind.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/edit" element={<FormEditor />} />
        <Route exact path="/preview" element={<FormPreview/>} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
