import React from "react";

const ReviewForm = () => {
  return (
    <form className="comment-form flex flex-col gap-3">
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
          <a href="#" className="star p-1 border-r border-gray-200">
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
          </a>
          <a href="#" className="star p-1 border-r border-gray-200">
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
          </a>
          <a href="#" className="star p-1 border-r border-gray-200">
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
          </a>
          <a href="#" className="star p-1 border-r border-gray-200">
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
          </a>
          <a href="#" className="star p-1">
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
            <i className="bi bi-star-fill text-gray-300 hover:text-yellow-400 transition-colors text-xs"></i>
          </a>
        </div>
      </div>
      <div className="comment-form-comment form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="comment" className="font-medium">
          Your review
          <span className="required text-red-500">*</span>
        </label>
        <textarea id="comment" cols="50" rows="10" className="border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-500"></textarea>
      </div>
      <div className="comment-form-author form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="name" className="font-medium">
          Name
          <span className="required text-red-500">*</span>
        </label>
        <input id="name" type="text" className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500" />
      </div>
      <div className="comment-form-email form-comment flex flex-col gap-1 text-sm">
        <label htmlFor="email" className="font-medium">
          Email
          <span className="required text-red-500">*</span>
        </label>
        <input id="email" type="email" className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500" />
      </div>
      <div className="comment-form-cookies flex items-center gap-2 text-sm">
        <input id="cookies" type="checkbox" className="rounded" />
        <label htmlFor="cookies">
          Save my name, email, and website in this browser for the next time I
          comment.
          <span className="required text-red-500">*</span>
        </label>
      </div>
      <div className="form-submit">
        <input type="submit" className="btn submit bg-black text-white px-6 py-2 rounded cursor-pointer hover:bg-gray-800 transition-colors" />
      </div>
    </form>
  );
};

export default ReviewForm;
