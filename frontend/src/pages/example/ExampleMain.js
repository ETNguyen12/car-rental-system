import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function ExampleMain() {
  const [exampleData, setExampleData] = useState(null); // State to hold data

  // Fetch data from /example
  const fetchAPI = async () => {
    try {
      const response = await api.get("/example/test"); 
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
        <ul>
          {exampleData.map((item) => (
            <li key={item.test_id}>
              Test ID: {item.test_id}, Test Name: {item.test_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default ExampleMain;