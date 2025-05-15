import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Public Routes
import Home from "./pages/Home.jsx";

function App() {
  return (
    <div data-theme="cupcake">
      <Router>
        {/* <NavBar /> */}
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          {/* Protected Routes */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
