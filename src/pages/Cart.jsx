import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Cart({ setUpdateCart }) {
  const [cartItems, setCartItems] = useState([]); //All cart items are formatted for easier display
  const [newCartItem, setNewCartItem] = useState(null); // New cart item to be added
  const [cartId, setCartId] = useState(null); //
  const [userInfo, setUserInfo] = useState({}); // User info from token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //const [cartFetched, setCartFetched] = useState(true); // Flag to check if cart is fetched

  const [searchParams] = useSearchParams();
  const newProductId = searchParams.get("productId");
  const newQuantity = parseInt(searchParams.get("quantity") || 1);
  const newRentalDate = searchParams.get("rentalDate");
  const newPrice = parseFloat(searchParams.get("price"));
  const [rentalDate, setRentalDate] = useState(newRentalDate || ""); // Initialize rentalDate state
  // const [itemsList, setItemsList] = useState([]);

  console.log("Date:", newRentalDate);

  const navigate = useNavigate();

  const API = `http://localhost:8080/api`;
  const token = localStorage.getItem("token");

  // Handle checkout button click
  // This function will redirect to the booking page
  const handleCheckout = () => {
    navigate("/booking");
  };

  // Fetch user info from server using token
  // This function will be called when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API}/users/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        console.log("User Info:", data);
        console.log("User ID:", data._id);
        setUserInfo(data);
      } catch (err) {
        console.error("User Info Error:", err);
        setError("Failed to load user info.");
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  useEffect(() => {
    //When the component mounts, check if there is a new productId in the URL
    //If there is, fetch the product details and add it to the cart
    //If there is no productId, just fetch the cart
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", newProductId);
        console.log(`Product Link: ${API}/products/${newProductId}`);
        const res = await fetch(`${API}/products/${newProductId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        console.log("Product Response from cart:", data);
        setNewCartItem(data); // the new product to be added with all details
        setCartItems((prevItems) => [
          // Add new product to cart items
          ...prevItems,
          {
            name: data.name,
            imageUrl: data.imageUrl,
            price: data.price,
            quantity: newQuantity || 1,
            rentalDate: rentalDate,
            _id: data._id,
          },
        ]);
        setUpdateCart((prev) => !prev); // Trigger cart update
        localStorage.setItem(
          "cartItemCount",
          (parseInt(localStorage.getItem("cartItemCount")) || 0) + 1
        ); // Update local storage count
        console.log(
          "Local Storage from Cart.jsx 1: ",
          localStorage.getItem("cartItemCount")
        );
        setLoading(false);
      } catch (err) {
        console.error("Product Error:", err);
        setError("Failed to load product.");
      }
    };
    if (newProductId) {
      fetchProduct();
    }
  }, [newProductId, token]);

  // useEffect(() => {
  //   if (userInfo._id && (newProductId ? newCartItem : true)) {
  //     fetchCart();
  //   }
  // }, [userInfo, newCartItem]);

  // Create a new cart if it doesn't exist
  const createNewCart = async () => {
    try {
      console.log("Item to be added to cart", newCartItem);
      console.log("User ID (from Post cart):", userInfo._id);
      const newCartRes = await fetch(`${API}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userInfo._id,
          itemsList: newProductId
            ? [
                {
                  productId: newCartItem._id,
                  // quantity: newQuantity || 1,
                  quantity: 1,
                  price: newCartItem.price, // price is ignored by backend populate
                },
              ]
            : [],
          totalPrice: newCartItem.price * 1, //newQuantity,

          rentalDate: rentalDate,
          deliveryAddress: "TBD",
          eventNotes: "",
        }),
      });

      if (!newCartItem || !newCartItem.price || !newQuantity) {
        console.log("Missing data to calculate totalPrice", {
          newCartItem,
          newQuantity,
        });
      }

      console.log("Cart failed to add", {
        userId: userInfo._id,
        itemsList: newProductId
          ? [
              {
                productId: newCartItem._id,
                quantity: 1,
                price: newCartItem.price, // price is ignored by backend populate
              },
            ]
          : [],
        totalPrice: newCartItem.price * 1,

        rentalDate: rentalDate,
        deliveryAddress: "TBD",
        eventNotes: "",
      });
      if (!newCartRes.ok) throw new Error("Failed to create cart");
      console.log("New Cart Response:", newCartRes);
      const data = await newCartRes.json();
      console.log("New cart created:", data);
      setCartId(data.result._id);

      //setUserInfo(data.result.userId);
      setCartItems(data.result.itemsList.map(formatItem));
      localStorage.setItem(
        "cartItemCount",
        data.result.itemsList.reduce((sum, item) => sum + item.quantity, 0)
      );
      console.log(
        "Local Storage from Cart.jsx 1: ",
        localStorage.getItem("cartItemCount")
      );
    } catch (err) {
      console.error("Create Cart Error:", err);
      setError("Failed to create cart.");
    }
  };

  /*
    If the user visits /cart?productId=..., wait for:
      1. userInfo._id
      2. newCartItem to be fetched

    If the user just visits /cart, wait only for:
      1. userInfo._id
  */

  useEffect(() => {
    // Fetch cart data from server
    const fetchCart = async () => {
      try {
        // If token is not present, there is no cart
        if (!token || !userInfo._id) return;

        //if token exists, fetch the cart

        const res = await fetch(`${API}/cart/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Cart Response:", res);

        // If the cart doesn't exist, create a new cart with only one new product
        if (!res.ok) {
          createNewCart();
        } else {
          // If the cart exists, read the cart data
          const cartData = await res.json();
          const cart = cartData.result;

          console.log("Cart Data:", cart);
          setCartId(cart._id);
          //setUserInfo(cart.userId);

          const updatedItems = [...cart.itemsList];

          console.log("Updated Items:", updatedItems);
          // Check if product is already in cart
          const alreadyInCart = updatedItems.some(
            //(item) => item.productId._id === newProductId
            (item) => item._id === newProductId
          );

          if (
            newProductId &&
            newQuantity &&
            !alreadyInCart /*&& newRentalDate*/
          ) {
            updatedItems.push({
              productId: newProductId,
              quantity: newQuantity,
              price: newCartItem.price,
              rentalDate: rentalDate,
            });

            const total = updatedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            // Save updated cart
            await fetch(`${API}/cart/${cart._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                itemsList: updatedItems.map((item) => ({
                  // productId: item.productId._id || item.productId,
                  productId: item._id || item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  rentalDate: rentalDate,
                })),
                totalPrice: total,
                rentalDate: rentalDate,

                deliveryAddress: cart.deliveryAddress || "TBD",
                eventNotes: cart.eventNotes || "",
              }),
            });
          }

          // Use fully populated items
          setCartItems(cart.itemsList.map(formatItem));

          localStorage.setItem(
            "cartItemCount",
            cart.itemsList.reduce((sum, item) => sum + item.quantity, 0)
          );

          console.log(
            "Local Storage from Cart.jsx 2: ",
            localStorage.getItem("cartItemCount")
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Cart Error:", err);
        setError("Failed to load cart.");
        setLoading(false);
      }
    };

    // Fallback logic:
    if (userInfo._id && (newProductId ? newCartItem : true)) {
      //&& !cartFetched) {
      console.log("Adding new product to existing cart...");
      fetchCart();
      //setCartFetched(true);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, newCartItem]);

  const formatItem = (item) => ({
    name: item.productId.name,
    imageUrl: item.productId.imageUrl,
    price: item.productId.price,
    quantity: item.quantity,
    rentalDate: rentalDate,
    _id: item.productId._id,
  });

  const updateQuantity = async (productId, newQty) => {
    const updatedItems = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity: newQty } : item
    );
    localStorage.setItem(
      "cartItemCount",
      updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    );

    console.log(
      "Local Storage from Cart.jsx 3 (update Quantity): ",
      localStorage.getItem("cartItemCount")
    );

    setUpdateCart((prev) => !prev);
    await saveCart(updatedItems);
  };

  const removeItem = async (productId) => {
    const updatedItems = cartItems.filter((item) => item._id !== productId);
    localStorage.setItem(
      "cartItemCount",
      updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    );

    console.log(
      "Local Storage from Cart.jsx 4: (removeItem)",
      localStorage.getItem("cartItemCount")
    );
    await saveCart(updatedItems);
  };

  const saveCart = async (items) => {
    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const response = await fetch(`${API}/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemsList: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            rentalDate: rentalDate,
          })),
          totalPrice: total,
          rentalDate: rentalDate,
          deliveryAddress: "TBD",
          eventNotes: "",
        }),
      });

      if (!response.ok) throw new Error("Failed to update cart");

      setCartItems(items);
      localStorage.setItem(
        "cartItemCount",
        items.reduce((sum, item) => sum + item.quantity, 0)
      );
    } catch (err) {
      console.error("Update Error:", err.message);
      setError("Failed to update cart.");
    }
  };

  if (loading) return <div className="p-4">Loading cart...</div>;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {userInfo && (
        <div className="mb-4">
          <p className="font-semibold">
            User: {userInfo.firstName} {userInfo.lastName}
          </p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p>Rental Date: {rentalDate || "N/A"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-bold pt-4 border-t">
            Total: ${total.toFixed(2)}
          </div>
          <button
            className="btn btn-primary mt-4"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
