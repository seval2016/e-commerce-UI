import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import PropTypes from "prop-types";

const Reviews = ({ blog, product }) => {
  const [reviews, setReviews] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const currentTarget = blog || product;
    if (currentTarget) {
      setTarget(currentTarget);
      if (currentTarget.reviews) {
        const approvedReviews = currentTarget.reviews
          .filter(review => review.isApproved)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(approvedReviews);
      }
    }
  }, [blog, product]);

  if (!target) {
    return null;
  }

  const reviewCount = reviews.length;
  const targetType = product ? 'product' : 'blog';

  return (
    <div className="tab-panel-reviews">
      <h3 className="text-xl font-semibold mb-6">
        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'} for {target.title || target.name}
      </h3>
      <div className="comments">
        {reviewCount > 0 ? (
          <ol className="comment-list flex flex-col gap-8">
            {reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">Be the first to leave a review!</p>
        )}
      </div>
      <div className="review-form-wrapper mt-8">
        <h2 className="text-lg font-medium mb-5 pb-4 border-b border-gray-200">Add a review</h2>
        <ReviewForm 
          targetId={target._id} 
          targetType={targetType}
          onReviewSubmit={() => {}} 
        />
      </div>
    </div>
  );
};

export default Reviews;

Reviews.propTypes = {
  blog: PropTypes.object,
  product: PropTypes.object,
};
