import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Editor from "./components/Editor";
import NavBar from "./components/NavBar";
import LoginPage from "./components/Login";
import PrivateRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/write' element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>

  );

}


