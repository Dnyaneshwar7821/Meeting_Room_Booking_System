import { useEffect, useState } from "react";
import API from "../services/api";
import { getErrorMessage } from "../utils/errors";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/toast";
import { SearchBar, Pagination, Badge, Button, EditIcon, DeleteIcon } from "../components/ui";

const Users = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    API.get("/users/get-all-users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  }

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      updateUser();
    } else {
      addUser();
    }
  };

  const addUser = () => {
    API.post("/users/add-user", user)
      .then(() => {
        fetchUsers();

        setUser({
          name: "",
          email: "",
          role: "EMPLOYEE",
        });

        showSuccess(
          `${user.role} added successfully. User can now create a password.`,
        );
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const updateUser = () => {
    API.put(`/users/update-user-by-id/${editId}`, user)
      .then(() => {
        fetchUsers();

        setEditId(null);

        setUser({
          name: "",
          email: "",
          role: "EMPLOYEE",
        });

        showSuccess("User updated successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const editUser = (selectedUser) => {
    setEditId(selectedUser.id);

    setUser({
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
    });
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) {
      return;
    }

    API.delete(`/users/delete-user/${id}`)
      .then(() => {
        fetchUsers();

        showSuccess("User deleted successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const currentRecords = filteredUsers.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">
            {loggedInUser?.systemAdmin
              ? "System Admin Workspace"
              : "Admin Workspace"}
          </p>

          <h1 className="portal-title">
            {loggedInUser?.systemAdmin
              ? "User Management"
              : "Employee Management"}
          </h1>

          <p className="portal-subtitle">
            {loggedInUser?.systemAdmin
              ? "Manage admins and employees."
              : "Manage employees created by you."}
          </p>
        </div>

        <div className="portal-panel mb-8 p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={user.name}
                onChange={handleChange}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                value={user.email}
                onChange={handleChange}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
              >
                <option value="EMPLOYEE">Employee</option>

                {loggedInUser?.systemAdmin && (
                  <option value="ADMIN">Admin</option>
                )}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:from-blue-700 hover:to-violet-700 hover:shadow-2xl hover:-translate-y-0.5"
              >
                {editId
                  ? loggedInUser?.systemAdmin
                    ? "Update User"
                    : "Update Employee"
                  : loggedInUser?.systemAdmin
                    ? "Add User"
                    : "Add Employee"}
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:max-w-sm"
          />
        </div>

        <div className="portal-panel overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>

                {loggedInUser?.systemAdmin && <th className="p-4">Role</th>}

                <th className="p-4">Edit</th>
                <th className="p-4">Delete</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((employee, index) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-center">{firstIndex + index + 1}</td>

                  <td className="p-4 text-center">{employee.name}</td>

                  <td className="p-4 text-center">{employee.email}</td>

                  {loggedInUser?.systemAdmin && (
                    <td className="p-4 text-center">
                      <Badge
                        variant={employee.role === "ADMIN" ? "primary" : "default"}
                        size="md"
                      >
                        {employee.role}
                      </Badge>
                    </td>
                  )}

                  <td className="p-4 text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => editUser(employee)}
                      leftIcon={<EditIcon className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                  </td>

                  <td className="p-4 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteUser(employee.id)}
                      leftIcon={<DeleteIcon className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={loggedInUser?.systemAdmin ? 6 : 5}
                    className="p-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">No users found</p>
                      <p className="text-sm text-slate-500">Try adjusting your search or add new users</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Users;