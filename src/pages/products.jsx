import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Import the default styles
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]); // State to hold the list of products
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const [bookedDates, setBookedDates] = useState([]); // State to hold booked dates
  const [availableDates, setAvailableDates] = useState([]); // State to hold available dates

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products"); // Fetch products from the API
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        console.log(data); // Log the fetched data for debugging
        setProducts(data); // Update the products state with the fetched data

        // Example: Extract booked and available dates from the API response
        const booked = data
          .map((product) => new Date(product.bookedDate))
          .filter((date) => !isNaN(date));
        const available = data
          .map((product) => new Date(product.availableDate))
          .filter((date) => !isNaN(date));
        setBookedDates(booked);
        setAvailableDates(available);
      } catch (error) {
        console.error("Error fetching products:", error); // Log any errors
        setError(error.message); // Set the error state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array to run only once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetching fails
  }

  if (products.length === 0) {
    return <div>No products available.</div>; // Show message if no products are found
  }

  return (
    <>
      <NavBar />
      <div className="container bg-secondary mx-auto px-4 py-8">
        <h1 className="text-primary text-3xl font-bold mb-6 text-center">
          Products
        </h1>

        {/* Product List */}
        <ul className="text-neutral grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li
              key={product._id}
              className="card bg-base-100 shadow-xl p-6 flex flex-col gap-2"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <strong className="text-sky-600 text-lg">{product.name}</strong>
                {/* <span className="font-semibold">${product.price}</span> */}
                {/* <p className="text-primary-600">{product.description}</p> */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Products;
