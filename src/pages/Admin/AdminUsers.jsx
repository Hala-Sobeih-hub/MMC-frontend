import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users and deletion requests
  const fetchUsersAndRequests = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersResponse = await fetch("http://localhost:8080/api/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      });
      const usersData = await usersResponse.json();
      setUsers(usersData.AllUsers);
      console.log("Users", usersData.AllUsers);
      // Fetch deletion requests
      const requestsResponse = await fetch(
        "http://localhost:8080/api/users/deletion-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
        }
      );
      const requestsData = await requestsResponse.json();
      setDeletionRequests(requestsData.pendingRequests);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRequests();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/update-role/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user role.");
      }

      alert(`User role updated to ${newRole} successfully.`);

      // Refetch users to ensure the frontend reflects the latest data
      fetchUsersAndRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to update user role. Please try again.");
    }
  };

  const handleRequestAction = async (requestId, action) => {
    const confirmationMessage =
      action === "approve"
        ? "Are you sure you want to approve this deletion request?"
        : "Are you sure you want to reject this deletion request?";

    if (!window.confirm(confirmationMessage)) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/deletion-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} deletion request.`);
      }

      alert(`Deletion request ${action}d successfully.`);

      // Update the deletionRequests state
      setDeletionRequests(
        deletionRequests.filter((request) => request._id !== requestId)
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} deletion request. Please try again.`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={Logo}
          alt="MMC Inflatables Logo"
          className="w-32 h-32 object-cover rounded-full"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>

      {/* All Users */}
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={user.role || "User"}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Deletion Requests
      <h2 className="text-2xl font-bold mt-8 mb-4">Deletion Requests</h2>
      <ul className="divide-y divide-gray-200">
        {deletionRequests.map((request) => (
          <li
            key={request._id}
            className="flex justify-between items-center py-4"
          >
            <div>
              <p>
                <strong>User:</strong> {request.firstName} {request.lastName}
              </p>
              <p>
                <strong>Email:</strong> {request.email}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleRequestAction(request._id, "approve")}
                className="btn btn-success"
              >
                Approve
              </button>
              <button
                onClick={() => handleRequestAction(request._id, "reject")}
                className="btn btn-warning"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
