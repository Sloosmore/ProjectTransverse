import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import Home from "./panel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatroom from "./chat-room";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  const [data, setData] = useState([]);

  /*useEffect(() => {
    // An async function to fetch data from the API
    async function fetchData() {
      // Logging the API URL from environment variables for debugging
      console.log(import.meta.env.VITE_API_URL);

      try {
        // Await the fetch call to the API and store the response
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}transcript/`
        );

        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
          // If not successful, throw an error
          throw new Error("Network response was not ok");
        }

        // Await the parsing of the response body as JSON
        const result = await response.json();

        // Log the result for debugging and update the state with the fetched data
        console.log(result);
        setData(result);
      } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error("Error fetching data:", error);
      }
    }

    // Call the fetchData function to initiate the fetch operation
    fetchData();
    // The empty dependency array tells React to run the effect once on mount
  }, []);*/

  return (
    <Router>
      <div className="container-fluid vh-100 d-flex">
        <div className="row flex-grow-1">
          <div
            className="col-3 bg-lightgrey p-0 d-flex flex-column"
            style={{ minWidth: "200px", maxWidth: "250px" }}
          >
            <Sidebar data={data} />
          </div>

          <div className="col">
            <Routes>
              <Route path="/c/:taskId" element={<Chatroom />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
