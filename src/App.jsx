// import React, { useEffect, useState } from "react"; // Import React and necessary hooks
// import { BrowserRouter as Router, useLocation } from "react-router-dom"; // Import Router and useLocation
// // import { Divider } from "@mui/material"; // Import Divider from Material-UI
// import AppRoutes from "./Routes/appRoutes"; // Import AppRoutes
// import { BASE_URL } from "./config"; // Import your API base URL config
// import Header from "./Components/header/header"; // Import the Header component

// function App() {
//   const [categories, setCategories] = useState([]); // State to store categories

//   // Fetch categories when the component is mounted
//   useEffect(() => {
//     fetch(`${BASE_URL}/category/category-list`) // API call to fetch categories
//       .then((response) => {
//         console.log("Response from category API:", response); // Log the response for debugging

//         if (!response.ok) {
//           throw new Error("Failed to fetch category list"); // Error handling
//         }
//         return response.json(); // Return JSON data
//       })
//       .then((data) => {
//         const categoryArray = data?.data?.[0]?.categories || []; // Extract categories from the response
//         setCategories(categoryArray); // Update state with categories
//       })
//       .catch((error) => {
//         console.error("Error fetching categories:", error); // Log any errors
//         setCategories([]); // Set categories to an empty array in case of an error
//       });
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   return (
//     <Router> {/* Ensure that the Router wraps the entire app */}
//       <AppContent categories={categories} /> {/* Pass the categories as a prop to the AppContent component */}
//     </Router>
//   );
// }

// function AppContent({ categories }) {
//   const location = useLocation(); // Get the current location (route)

//   // Check if we are on the "Post Your Thoughts" page
//   const isPostThoughtsPage = location.pathname === "/post-thoughts";

//   return (
//     <div className={`min-h-screen ${isPostThoughtsPage ? 'bg-gradient-to-r from-[#020213] to-[#091C38]' : ''}`}>
//       {/* Only show header if not on the Post Your Thoughts page */}
//       {!isPostThoughtsPage && <Header categories={categories} />}

//       {/* Only show divider if not on the Post Your Thoughts page */}
//       {/* {!isPostThoughtsPage && (
//         <Divider sx={{ backgroundColor: "#fff", margin: "20px auto", width: "80%" }} />
//       )} */}

//       <main className={`${isPostThoughtsPage ? 'bg-cover bg-center' : ''} py-8`}>
//         <div className="container mx-auto">
//           <AppRoutes /> {/* Route handling */}
//         </div>
//       </main>

//       {/* Only show footer if not on the Post Your Thoughts page */}
//       {!isPostThoughtsPage && (
//         <footer className="bg-gradient-to-r from-[#020213] to-[#091C38] text-white py-6">
//           <div className="container mx-auto">
//             <p className="text-center text-sm">
//               © {new Date().getFullYear()}. All rights reserved.
//             </p>
//           </div>
//         </footer>
//       )}
//     </div>
//   );
// }

// export default App;



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