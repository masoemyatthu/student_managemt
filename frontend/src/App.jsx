import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

// Pages
import Students from "./pages/Students";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="containers">
        {/* Sidebar */}
        <Sidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />

        <div className={`main-contents ${sidebarOpen ? "sidebar-open" : ""}`}>
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} />

          <div className="content-wrappers">
            <Routes>
              <Route path="/" element={<Students />} />

              <Route path="/students" element={<Students />} />


            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
