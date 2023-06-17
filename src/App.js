import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from "./Main";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Term from "./Term";
import Privacy from "./Privacy";
import Cookies from "./Cookies";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer pauseOnFocusLoss={false} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/terms-conditions" element={<Term />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/cookies-policy" element={<Cookies />} />
            
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
