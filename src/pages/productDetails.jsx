import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate, useLocation } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(); // State to
  // hold the selected date
  const [quantity, setQuantity] = useState(1); // State to hold the quantity

  const navigate = useNavigate();
  const location = useLocation();

  const handleBook = async () => {
    // Handle booking logic here
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        //save the current location to redirect after login
        navigate("/login", { state: { from: location.pathname + location.search } });
        return;
      }

      setQuantity(1); // Reset quantity to 1 after booking

      //Hala made changes here
      //   const response = await fetch("http://localhost:8080/api/cart", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },

      //     body: JSON.stringify({
      //       itemList: [
      //         {
      //           productId: product._id,
      //           quantity: 1,
      //           price: product.price,
      //         },
      //       ],
      //       totalPrice: product.price,
      //       rentalDate: selectedDate,
      //       deliveryAddress: "", // Will be added in Booking page
      //       eventNotes: "", // Will be added in Booking page
      //     }),

      // body: JSON.stringify({
      //   productId: product._id,
      //   name: product.name,
      //   date: selectedDate,
      //   quantity: quantity,
      // }),
      //   });

      //   const data = await response.json();
      //   console.log("Added to cart:", data);
      console.log("Product passed to cart:", {
        productId: product._id,
        name: product.name,
        date: selectedDate,
        quantity: quantity,
        price: product.price,
      });

      navigate(
        `/cart?productId=${product._id}&quantity=${quantity}&price=${
          product.price
        }&rentalDate=${selectedDate.toLocaleDateString()}`
      ); // Redirect to the cart page after adding
    } catch (error) {
      //   console.error("Error adding to cart:", error);
      console.error("Error going to cart:", error);
    }

    // console.log("from the product details page", {
    //   productId: product._id,
    //   name: product.name,
    //   date: selectedDate,
    //   quantity: quantity,
    // });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${
            window.location.pathname.split("/")[2]
          }`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="bg-secondary container mx-auto px-4 py-8">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full max-w-md h-68 object-cover rounded-lg mb-4 mx-auto"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <span className="font-semibold text-lg">${product.price}</span>
      <p className="text-primary-600 mb-4">{product.description}</p>
      <div className="mt-2 flex justify-center">
        <div className="bg-primary rounded-xl p-4 shadow">
          <DayPicker
            selected={selectedDate} // Pass the selected date to the DayPicker
            onDayClick={(day) => setSelectedDate(day)} // Update the selected date on click
            onSelect={setSelectedDate} // Update the selected date
            modifiers={{
              booked: product.bookedDate ? [new Date(product.bookedDate)] : [],
              available: product.availableDate
                ? [new Date(product.availableDate)]
                : [],
            }}
            modifiersStyles={{
              booked: {
                textDecoration: "line-through",
                backgroundColor: "#f67a48",
              },
              available: { backgroundColor: "#32b0a9", color: "white" },
            }}
          />
        </div>

        {selectedDate && (
          <div className="flex flex-col justify-center items-center min-w-[180px]">
            <span className="font-medium">
              Selected Date: {selectedDate.toLocaleDateString()}
            </span>
            {/* Add your booking button here */}
            <button className="btn btn-accent text-white ml-4" onClick={handleBook}>
              Book This Date
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;