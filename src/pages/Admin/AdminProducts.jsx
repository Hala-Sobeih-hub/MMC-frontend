import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product
  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const daysFromNow = 30;
      const availableDate = new Date();
      availableDate.setDate(availableDate.getDate() + daysFromNow);

      const productToSend = {
        ...form,
        available: true,
        availableDate: availableDate.toISOString(),
      };
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToSend),
      });
      if (!res.ok) throw new Error("Failed to add product");
      setForm({ name: "", description: "", price: "", imageUrl: "" });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", description: "", price: "", imageUrl: "" });
    setShowModal(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update product");
      fetchProducts();
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-secondary">
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin: Manage Products</h2>
        <form onSubmit={handleAdd} className="space-y-2 mb-8 p-4 rounded">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-accent w-full"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-2">All Products</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                {editId === p._id ? (
                  <div className="flex items-center gap-4 w-full">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="input input-bordered w-24"
                      placeholder="Name"
                    />
                    <input
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="input input-bordered w-32"
                      placeholder="Description"
                    />
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="input input-bordered w-20"
                      placeholder="Price"
                    />
                    <input
                      name="imageUrl"
                      value={editForm.imageUrl}
                      onChange={handleEditChange}
                      className="input input-bordered w-16"
                      placeholder="Image URL"
                    />
                    <img
                      src={editForm.imageUrl}
                      alt={editForm.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => { e.target.src = "https://via.placeholder.com/64"; }}
                    />
                    
                    <button
                      className="btn btn-sm bg-accent text-white"
                      onClick={() => saveEdit(p._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm bg-gray-300"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => { e.target.src = "https://via.placeholder.com/64"; }}
                    />
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-sm text-gray-500">${p.price}</div>
                      <div className="text-xs text-gray-400">{p.description}</div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button
                        className="btn btn-sm bg-accent text-white"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm bg-primary text-white"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
              <input
                name="imageUrl"
                value={editForm.imageUrl}
                onChange={handleEditChange}
                className="input input-bordered w-full mb-4"
                placeholder="Image URL"
              />
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="input input-bordered w-full mb-4"
                placeholder="Name"
              />
              <input
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="input input-bordered w-full mb-4"
                placeholder="Description"
              />
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                className="input input-bordered w-full mb-4"
                placeholder="Price"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-accent text-white"
                  onClick={() => saveEdit(editId)}
                >
                  Save
                </button>
                <button
                  className="btn btn-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
