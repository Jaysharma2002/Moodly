import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminManage.css";

const AdminManage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/getUsers");
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:8000/api/updatedUser/${editId}`, form);
    } else {
      await axios.post("http://localhost:8000/api/getUsers", form);
    }
    setForm({ name: "", email: ""});
    setEditId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/deletedUser/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user._id);
  };

  return (
    <div className="adminmanage-container">
      <div className="admin-card">
        <h2 className="admin-title">Admin User Management</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <button className="submit-btn">{editId ? "Update" : "Add"} User</button>
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="delete1-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default AdminManage;
