
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./Routes/appRoutes";
import { BASE_URL } from "./config";
import Footer from "./Components/Common/footer";
import Header from "./Components/header/header";

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/category/category-list`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch category list");
        }
        return response.json();
      })
      .then((data) => {
        const categoryArray = data?.data?.[0]?.categories || [];
        setCategories(categoryArray);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  return (
    <Router>
      <AppContent categories={categories} />
    </Router>
  );
}

function AppContent({ categories }) {
  const location = useLocation();
  const isPostThoughtsPage = location.pathname === "/post-thoughts";

  return (
    <div className={`min-h-screen pb-20 ${isPostThoughtsPage ? 'bg-gradient-to-r from-[#020213] to-[#091C38]' : ''}`}>
      {!isPostThoughtsPage && <Header categories={categories} />}

      <main className={`${isPostThoughtsPage ? 'bg-cover bg-center' : ''} py-8`}>
        <div className="container mx-auto">
          <AppRoutes />
        </div>
      </main>

      {!isPostThoughtsPage && <Footer />}
    </div>
  );
}

export default App;