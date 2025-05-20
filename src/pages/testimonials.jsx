import { useState, useEffect } from "react";




const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]); // State to hold the list of testimonials
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/testimonials"); // Fetch testimonials from the API
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); // Parse the JSON response
                setTestimonials(data); // Update the testimonials state with the fetched data
            } catch (error) {
                console.error("Error fetching testimonials:", error); // Log any errors
                setError(error.message); // Set the error state
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchTestimonials(); // Call the fetch function
    }, []); // Empty dependency array to run only once on component mount

    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message if fetching fails
    }

    if (testimonials.length === 0) {
        return <div>No testimonials available.</div>; // Show message if no testimonials are found
    }

    return (
        <div>
            <h1>Testimonials</h1>
            <ul>
                {testimonials.map((testimonial) => (
                    <li key={testimonial.id}>
                        <p>{testimonial.content}</p>
                        <p>- {testimonial.author}</p>

                        <p>
                            Rating:{" "}
                            {"⭐".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating)}

                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Testimonials;