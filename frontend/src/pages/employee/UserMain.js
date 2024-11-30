import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "./components/Navbar";
import UsersTable from "./components/UsersTable";
import UserDetails from "./components/UserDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserMain() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/employee/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid bg-light py-2" style={{ display: "flex", height: "100vh" }}>
      <Navbar onUsersClick={fetchUsers} />
      <UsersTable
        users={users}
        selectedUser={selectedUser}
        onRowClick={setSelectedUser}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <UserDetails selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default UserMain;