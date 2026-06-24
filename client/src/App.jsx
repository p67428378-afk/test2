import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BookCatalogPage from "./pages/BookCatalogPage.jsx";
import AddBookPage from "./pages/AddBookPage.jsx";

function App() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <Router>
      <AppLayout searchVal={searchVal} onSearchChange={setSearchVal}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/catalog"
            element={<BookCatalogPage searchVal={searchVal} />}
          />
          <Route path="/add-book" element={<AddBookPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
