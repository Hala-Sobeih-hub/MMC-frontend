import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [newCartItem, setNewCartItem] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const newProductId = searchParams.get("productId");
  const newQuantity = parseInt(searchParams.get("quantity"));
  const newRentalDate = searchParams.get("rentalDate");
  const [rentalDate, setRentalDate] = useState(newRentalDate || ""); // Initialize rentalDate state

  console.log("Date:", newRentalDate);

  const API = `http://localhost:8080/api`;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Handle checkout button click
  // This function will redirect to the booking page
  const handleCheckout = () => {
    navigate("/booking"); // or add query string or state if needed
  };

  useEffect(() => {
    //fetch the product details from the backend
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${newProductId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        console.log("Product Response:", data.result);
        setNewCartItem(data.result);
      } catch (err) {
        console.error("Product Error:", err);
        setError("Failed to load product.");
      }
    };
    if (newProductId) {
      fetchProduct();
    }
  }, [newProductId, token]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        //if token exists, fetch the cart
        if (token) {
          const res = await fetch(`${API}/cart/user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Cart Response:", res);

          // If the cart doesn't exist, create a new one
          if (!res.ok) {
            const newCartRes = await fetch(`${API}/cart/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                itemsList: newProductId
                  ? [
                      {
                        productId: newProductId,
                        quantity: newQuantity || 1,
                        price: 0, // price is ignored by backend populate
                      },
                    ]
                  : [],
                totalPrice: itemsList.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ),
                rentalDate: rentalDate,
                deliveryAddress: "TBD",
                eventNotes: "",
              }),
            });
            const data = await newCartRes.json();
            console.log("New cart created:", data.result);
            setCartId(data.result._id);

            setUserInfo(data.result.userId);
            setCartItems(data.result.itemsList.map(formatItem));
            localStorage.setItem(
              "cartItemCount",
              data.result.itemsList.reduce(
                (sum, item) => sum + item.quantity,
                0
              )
            );
          } else {
            // If the cart exists, read the cart data
            const cartData = await res.json();
            const cart = cartData.result;
            setCartId(cart._id);
            setUserInfo(cart.userId);

            const updatedItems = [...cart.itemsList];

            // Check if product is already in cart
            const alreadyInCart = updatedItems.some(
              (item) => item.productId._id === newProductId
            );

            if (
              newProductId &&
              newQuantity &&
              newRentalDate &&
              !alreadyInCart
            ) {
              updatedItems.push({
                productId: { _id: newProductId }, // placeholder
                quantity: newQuantity,
                price: 0,
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
                    productId: item.productId._id || item.productId,
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
              data.result.itemsList
                .map(formatItem)
                .reduce((sum, item) => sum + item.quantity, 0)
            );
          }

          setLoading(false);
        }
      } catch (err) {
        console.error("Cart Error:", err);
        setError("Failed to load cart.");
        setLoading(false);
      }
    };

    fetchCart();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    await saveCart(updatedItems);
  };

  const removeItem = async (productId) => {
    const updatedItems = cartItems.filter((item) => item._id !== productId);
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
