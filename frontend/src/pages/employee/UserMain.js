import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "./components/Navbar";
import UsersTable from "./components/UsersTable";
import UserDetails from "./components/UserDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/employee.css";

function UserMain() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/employee/users/info");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const onDeleteUser = async (userId) => {
    try {
      await api.delete(`/employee/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const onSaveUser = async (userData) => {
    try {
      const response = await api.post("/auth/customers/create", userData); 
      if (response.status === 201) {
        toast.success("User added successfully!");
        fetchUsers(); 
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0"); 
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); 
    const year = date.getUTCFullYear();
  
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="container-fluid bg-light py-2" style={{ display: "flex", height: "100vh" }}>
      <Navbar onUsersClick={fetchUsers} />
      <UsersTable
        users={users}
        selectedUser={selectedUser}
        onRowClick={setSelectedUser}
        formatDate={formatDate}
        onSaveUser={onSaveUser} 
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <UserDetails 
          selectedUser={selectedUser} 
          onDeleteUser={onDeleteUser}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}

export default UserMain;