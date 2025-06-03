import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//importing Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:8080/api";

export default function Inquiry() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(""); //product chosen by user
  const [inquiryDescription, setInquiryDescription] = useState("");

  //list of products provided by the company
  const [productsList, setProductsList] = useState([]);

  const [message, setMessage] = useState("");
  //used to display the success toast
  const [successMessage, setSuccessMessage] = useState(""); // Create the message state variable

  //Run this effect once when the page mounts
  useEffect(() => {
    //get the products (provided by the company) from the API
    fetch(`${API}/products`)
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setProductsList(data)) //set the services state variable
      .catch((error) => console.log(error)); //log any errors
  }, []);

  //Used to display the success Toast
  useEffect(() => {
    if (successMessage) {
      console.log(`from Inquiry.jsx : ${successMessage}`);

      toast.success(successMessage, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      });
      // Reset successMessage after showing the toast
      setSuccessMessage("");
    }
  }, [successMessage]); // Toast only shows when successMessage changes

  //handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    try {
      const newInquiry = {
        name,
        email,
        phone,
        address,
        // send the product name instead of ID by finding it in productsList
        productName: productsList.find((p) => p._id === selectedProduct)?.name,
        inquiryDescription,
      };

      //send the inquiry by email by nodemailer
      const res = await fetch(`${API}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInquiry),
      });

      // if (!res.ok) throw new Error("Failed to update address");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit inquiry");
      }
      const messageRecieved = await res.json();

      console.log("Message Recieved:", messageRecieved.message);

      setSuccessMessage(messageRecieved.message); //set the success message state variable
      // reset the form fields after successful submission
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setSelectedProduct(""); //Reset selected services
      setInquiryDescription("");
      // setMessage("Inquiry submitted successfully!");
      setMessage("");

      // Navigate back to the previous page and pass the success message

      // Navigate only after showing the success message
      setTimeout(() => {
        navigate(-1, {
          state: { message: message || "Inquiry submitted successfully!" },
        });
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      //setMessage("Error adding inquiry");
      setMessage(error.message);
    }
  };

  useEffect(() => {
    console.log("Available Products:", productsList);
  }, [productsList]);

  return (
    <div className="bg-secondary">
      <div className="flex justify-center items-center min-h-screen">
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Inquiry Contact Form
          </h2>

          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Name Field */}
            <label className="text-gray-700 font-medium text-right">
              Name <text className="text-red-500">*</text>
            </label>
            <input
              type="text"
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              //****** ONLY For Demo --- Start
              onClick={(e) => {
                e.target.value = "Daniel Harris";
              }}
            //****** ONLY For Demo --- End
            />

            {/* Email Field */}
            <label className="text-gray-700 font-medium text-right">
              Email <text className="text-red-500">*</text>
            </label>
            <input
              type="email"
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //****** ONLY For Demo --- Start
              onClick={(e) => {
                e.target.value = "daniel.harris@email.com";
              }}
            //****** ONLY For Demo --- End
            />

            {/* Phone Field */}
            <label className="text-gray-700 font-medium text-right">
              Phone <text className="text-red-500">*</text>
            </label>
            <input
              type="tel"
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              //****** ONLY For Demo --- Start
              onClick={(e) => {
                e.target.value = "512-555-1239";
              }}
            //****** ONLY For Demo --- End
            />

            {/* Address Field */}
            <label className="text-gray-700 font-medium text-right">
              Address <text className="text-red-500">*</text>
            </label>
            <input
              type="text"
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              //****** ONLY For Demo --- Start
              onClick={(e) => {
                e.target.value = "38 Union Ave, Manasquan, NJ 08736";
              }}
            //****** ONLY For Demo --- End
            />

            {/* Product Field */}
            <label className="text-gray-700 font-medium text-right">
              Product <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2 flex flex-col space-y-2">
              <select
                className="border rounded px-4 py-2 text-gray-700"
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  console.log(`Selected: ${e.target.value}`);
                }}
              >
                <option value="" disabled>
                  Select a product
                </option>
                {productsList.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Field */}
            <label className="text-gray-700 font-medium text-right">
              Description <text className="text-red-500">*</text>
            </label>
            <textarea
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Enter inquiry description"
              value={inquiryDescription}
              rows="4"
              onChange={(e) => setInquiryDescription(e.target.value)}
              //****** ONLY For Demo --- Start
              onClick={(e) => {
                e.target.value =
                  "Dear MMC Team, I would like to inquire about the availability of your services for an upcoming event. Please let me know the details at your earliest convenience. Thank you!";
              }}
            //****** ONLY For Demo --- End
            ></textarea>
          </div>

          <div>
            {/* Buttons */}
            <div className="flex justify-around mt-6">
              <button
                type="submit"
                className="w-1/3 bg-[#4a9cd3] text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
              <button
                type="button"
                className="w-1/3 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={() => navigate(-1)} // Navigates back
              >
                Back
              </button>
            </div>
            {message && (
              <p className="confirmAdd text-red-500 text-xl p-4 text-center">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
