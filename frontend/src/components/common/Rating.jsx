import PropTypes from 'prop-types';

const Rating = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-sm"></i>
        ))}
        {halfStar && <i className="bi bi-star-half text-sm"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-sm"></i>
        ))}
      </div>
      {reviews && (
        <span className="text-sm text-gray-500">
          ({reviews} reviews)
        </span>
      )}
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  reviews: PropTypes.number,
};

export default Rating; 