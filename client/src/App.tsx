import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import PetListPage from './pages/PetListPage';
import './App.css';
import PetProfilePage from './pages/PetProfilePage';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/pets" element={<PetListPage />} />
          <Route path="/pets/:petId" element={<PetProfilePage />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
