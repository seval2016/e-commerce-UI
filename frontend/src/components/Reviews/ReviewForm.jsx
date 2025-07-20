import React, { useState } from "react";
import Button from "../common/Button";
import PropTypes from 'prop-types';

const API_BASE_URL = "http://localhost:5000";

const ReviewForm = ({ blogId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !review || !name || !email) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          text: review,
          name,
          email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      setSuccess("Your review has been submitted successfully!");
      if (onReviewSubmit) {
        onReviewSubmit(result.review); // Pass the new review to the parent
      }
      
      // Clear form
      setRating(0);
      setReview("");
      setName("");
      setEmail("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form flex flex-col gap-3" onSubmit={handleSubmit}>
      <p className="comment-notes text-sm text-gray-600">
        Your email address will not be published. Required fields are marked
        <span className="required text-red-500">*</span>
      </p>
      <div className="comment-form-rating">
        <label className="text-sm font-medium">
          Your rating
          <span className="required text-red-500">*</span>
        </label>
        <div className="stars flex mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <a key={star} href="#" className="star" onClick={(e) => { e.preventDefault(); setRating(star); }}>
              <i
                className={`bi bi-star-fill text-lg transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              ></i>
            </a>
          ))}
        </div>
      </div>
      <div className="comment-form-comment form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="comment" className="font-medium">
          Your review
          <span className="required text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          cols="50"
          rows="5"
          className="border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-500"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="comment-form-author form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="name" className="font-medium">
          Name
          <span className="required text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="comment-form-email form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="email" className="font-medium">
          Email
          <span className="required text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <div className="form-submit mt-2">
        <Button type="submit" variant="primary" size="md" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  blogId: PropTypes.string.isRequired,
  onReviewSubmit: PropTypes.func,
};

export default ReviewForm;
