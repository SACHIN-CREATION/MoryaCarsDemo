// src/App.jsx
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
      <AppRoutes />
  );
}

export default App;
