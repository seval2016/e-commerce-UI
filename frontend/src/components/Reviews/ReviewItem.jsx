import PropTypes from "prop-types";

const ReviewItem = ({ review }) => {
  if (!review) return null;

  // Tarihi daha okunabilir bir formata getirelim
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <li className="comment-item flex items-start gap-4 p-4 rounded-lg bg-gray-50">
      <div className="comment-avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={e => { e.target.src = '/img/avatar-default.png'; }}
          />
        ) : (
          review.name?.charAt(0).toUpperCase()
        )}
      </div>
      <div className="comment-text flex-1">
        <div className="comment-meta flex items-center gap-3 mb-2">
          <b className="comment-author text-gray-800">{review.name}</b>
          <time className="text-xs text-gray-500">{formattedDate}</time>
        </div>
        <div className="star-rating flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <i
              key={index}
              className={`bi bi-star-fill text-sm ${
                index < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            ></i>
          ))}
        </div>
        <div className="comment-description mt-3 text-gray-700">
          <p>{review.text}</p>
        </div>
      </div>
    </li>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewItem;
