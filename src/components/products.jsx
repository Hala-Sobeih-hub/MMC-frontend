import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Import the default styles

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
                setProducts(data); // Update the products state with the fetched data

                // Example: Extract booked and available dates from the API response
                const booked = data.map((product) => new Date(product.bookedDate)); // Replace `bookedDate` with your API field
                const available = data.map((product) => new Date(product.availableDate)); // Replace `availableDate` with your API field
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
        <div>
            <h1>Products</h1>

            {/* Day Picker with Custom Modifiers */}
            <div>
                <h2>Calendar</h2>
                <DayPicker
                    modifiers={{
                        booked: bookedDates,
                        available: availableDates,
                    }}
                    modifiersStyles={{
                        booked: { textDecoration: "line-through", backgroundColor: "#f67a48" },
                        available: { backgroundColor: "#32b0a9", color: "white" },
                    }}
                />
            </div>

            {/* List of products */}
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <strong>{product.name}</strong> - ${product.price}
                        <p>{product.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;