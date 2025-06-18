import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, Typography, Button } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config"; // Replace with your actual API endpoint
import Loader from "../Components/Common/Loader"; // Assuming a Loader component exists

const theme = createTheme(); // Using Material UI's theme

function AboutMe() {
  const [aboutData, setAboutData] = useState(null); // State to store About Me data
  const [loading, setLoading] = useState(true); // Loading state to manage loader visibility

  // Fetch About Me data on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/about/about-list`);
        console.log(response.data, "Response Data"); // Log the response to check its structure
        
        setAboutData(response.data.data[0]); // Assuming the 'data' contains the relevant user info
      } catch (error) {
        console.error("Error fetching About Me data:", error);
      } finally {
        setLoading(false); // Stop loading state after data is fetched
      }
    };

    fetchAboutData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main style={{
        background: 'linear-gradient(to bottom right, #020213, #091C38)', 
        color: 'white', 
        padding: '24px',
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Loading or About Content */}
        {loading ? (
          <Loader /> // Show loading indicator if the data is being fetched
        ) : aboutData ? (
          <div style={{
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '20px', 
            borderRadius: '10px', 
            maxWidth: '800px', 
            width: '100%',
          }}>
            {/* Profile Picture */}
            {aboutData.photo && (
              <img
                src={aboutData.photo} 
                alt="Profile"
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }}
              />
            )}

            {/* Name and Designation */}
            <Typography variant="h4" className="font-semibold" style={{ color: '#ffffff', marginBottom: '10px' }}>
              {aboutData.name}
            </Typography>
            <Typography variant="h6" className="text-lg" style={{ color: '#b0b0b0', marginBottom: '20px' }}>
              {aboutData.designation}
            </Typography>

            {/* Bio Section */}
            <div style={{ color: '#dcdcdc', textAlign: 'left', lineHeight: '1.8' }}>
              <Typography variant="body1" style={{ marginBottom: '10px' }}>
                {aboutData.content}
              </Typography>
            </div>

            {/* Contact Button */}
            <Button 
              variant="contained" 
              color="primary" 
              style={{
                marginTop: '20px', 
                padding: '10px 30px', 
                borderRadius: '8px', 
                backgroundColor: '#3f51b5', // Custom color for button
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'none',
                transition: 'background-color 0.3s ease', 
              }}
              onClick={() => window.open("https://www.linkedin.com/in/majamal/", "_blank")} // Opens LinkedIn in a new tab
            >
              Contact Me
            </Button>
          </div>
        ) : (
          <Typography variant="h6" style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
            No About Me data found.
          </Typography>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#020213] to-[#091C38] text-white py-6">
        <div className="container mx-auto text-center">
          {/* Display Email and Phone Number in Footer */}
          {aboutData && (
            <>
              <Typography variant="body2" className="text-sm" style={{ color: '#dcdcdc' }}>
                Email: {aboutData.email}
              </Typography>
              <Typography variant="body2" className="text-sm" style={{ color: '#dcdcdc' }}>
                Phone: {aboutData.phone}
              </Typography>
            </>
          )}
        
        </div>
      </footer>
    </ThemeProvider>
  );
}

export default AboutMe;
