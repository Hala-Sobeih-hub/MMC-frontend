import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Input, Textarea, Button } from "@heroui/react";

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const [form, setForm] = useState({ name: "", reviews: "", rating: 5 });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((i) => (i + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/testimonials/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(form),
      });
      const newTestimonial = await res.json();
      setTestimonials((prev) => [...prev, newTestimonial]);
      setForm({ name: "", reviews: "", rating: 5 });
      setCurrentIndex(testimonials.length);
      setShowForm(false);
    } catch (err) {
      console.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0 }),
  };

  if (loading || !testimonials.length) return <div>Loading testimonials...</div>;

  const current = testimonials[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-8 font-sans text-gray-800 px-4">

      {/* Testimonial Card */}
      <div className="relative bg-gradient-to-tr from-secondary via-gray-50 to-secondary rounded-xl shadow-xl p-6 min-h-[180px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 p-4"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="relative text-lg italic text-gray-600 leading-relaxed">
                <Icon icon="lucide:quote" className="absolute -top-2 -left-2 text-[#f67a48] opacity-40" width={32} />
                “{current.reviews}”
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="text-base font-semibold text-gray-700">{current.name}</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="lucide:star"
                      className={i < current.rating ? "text-[#f67a48]" : "text-gray-300"}
                      width={18}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex ? "bg-[#f67a48]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Leave Review Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          style={{
            backgroundColor: "#f67a48",
            color: "#fff",
            minWidth: "200px",
            height: "48px",
            borderRadius: "1rem",
            fontSize: "1.1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          aria-label={showForm ? "Close Form" : "Leave a Review"}
        >
          <Icon icon={showForm ? "lucide:x" : "lucide:plus"} width={22} height={22} />
          {showForm ? "Close Form" : "Leave a Review"}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 bg-white rounded-lg p-5 shadow-md border border-gray-200"
          >
            <h3 className="text-md font-bold">Submit Your Testimonial</h3>
            <Input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="reviews"
              placeholder="Your Review"
              value={form.reviews}
              onChange={handleInputChange}
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={(hoverRating || form.rating) >= star ? "text-[#f67a48]" : "text-gray-300"}
                >
                  <Icon icon="lucide:star" width={20} />
                </button>
              ))}
            </div>
            <Button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: "#f67a48",
                color: "#fff",
                width: "100%",
                padding: "0.5rem",
                fontWeight: "600",
                borderRadius: "0.5rem",
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialCarousel;
