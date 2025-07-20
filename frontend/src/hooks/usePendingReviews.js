import { useState, useEffect, useCallback } from "react";
import { message } from "antd";

const API_BASE_URL = "http://localhost:5000";

const usePendingReviews = (type) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const endpoint = type === 'blogs' ? '/api/blogs/reviews/pending' : '/api/products/reviews/pending';
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch pending ${type} reviews.`);
      const data = await response.json();
      setReviews(data.pendingReviews || []);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const approveReview = useCallback(async (review) => {
    const { blogId, productId, reviewId } = review;
    const endpoint = type === 'blogs' 
      ? `/api/blogs/${blogId}/reviews/${reviewId}/approve`
      : `/api/products/${productId}/reviews/${reviewId}/approve`;
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to approve review.");
      
      message.success("Review approved successfully!");
      setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
      return true; // Indicate success
    } catch (err) {
      message.error(err.message);
      return false; // Indicate failure
    }
  }, [type]);

  const deleteReview = useCallback(async (review) => {
    const { blogId, productId, reviewId } = review;
    const endpoint = type === 'blogs' 
      ? `/api/blogs/${blogId}/reviews/${reviewId}`
      : `/api/products/${productId}/reviews/${reviewId}`;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error("Failed to delete review.");

      message.success("Review deleted successfully!");
      setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
      return true; // Indicate success
    } catch (err) {
      message.error(err.message);
      return false; // Indicate failure
    }
  }, [type]);

  return { reviews, loading, approveReview, deleteReview };
};

export default usePendingReviews; 