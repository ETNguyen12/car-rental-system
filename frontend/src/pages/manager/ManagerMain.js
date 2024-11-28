import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function ManagerMain() {
  const [exampleData, setExampleData] = useState(null); // State to hold data

  // Fetch data from /example
  const fetchAPI = async () => {
    try {
      const response = await api.get("/manager"); 
      setExampleData(response.data); 
    } catch (error) {
      console.error("Error fetching example data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="container-fluid">
      <h1>Example Main Page</h1>
      {exampleData ? (
        <p>{exampleData.message}</p>
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default ManagerMain;