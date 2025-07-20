import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import PropTypes from "prop-types";

const Reviews = ({ blog }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (blog && blog.reviews) {
      // Sadece onaylanmış yorumları filtrele ve sırala
      const approvedReviews = blog.reviews
        .filter(review => review.isApproved)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(approvedReviews);
    }
  }, [blog]);

  const handleReviewSubmit = (newReview) => {
    // Yeni yorumu listeye eklemiyoruz, çünkü onaya düşecek.
    // Bunun yerine kullanıcıya bir bildirim gösterebiliriz.
    // Bu mantık zaten ReviewForm içinde hallediliyor.
    // Belki burada bir state tutulup "Yorumunuz başarıyla gönderildi..." mesajı gösterilebilir.
  };

  if (!blog) {
    return null; // Blog verisi henüz gelmediyse bir şey gösterme
  }

  const reviewCount = reviews.length;

  return (
    <div className="tab-panel-reviews">
      <h3 className="text-xl font-semibold mb-6">
        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'} for {blog.title}
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
        <ReviewForm blogId={blog._id} onReviewSubmit={handleReviewSubmit} />
      </div>
    </div>
  );
};

export default Reviews;

Reviews.propTypes = {
  blog: PropTypes.object,
};
