const ReviewItem = () => {
  return (
    <li className="comment-item flex items-center gap-4">
      <div className="comment-avatar">
        <img src="/img/avatars/avatar1.jpg" alt="" className="w-12 h-12 rounded-full" />
      </div>
      <div className="comment-text flex flex-col gap-1.5">
        <ul className="comment-star flex">
          <li>
            <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
          </li>
          <li>
            <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
          </li>
          <li>
            <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
          </li>
          <li>
            <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
          </li>
          <li>
            <i className="bi bi-star-fill text-yellow-400 text-xs"></i>
          </li>
        </ul>
        <div className="comment-meta text-xs text-gray-600">
          <strong>admin</strong>
          <span>-</span>
          <time>April 23, 2022</time>
        </div>
        <div className="comment-description">
          <p className="text-sm text-gray-700">
            Sed perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium.
          </p>
        </div>
      </div>
    </li>
  );
};

export default ReviewItem;
