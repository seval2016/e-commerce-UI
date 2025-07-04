import PropTypes from "prop-types";

const Dialog = ({ isDialogShow, setIsDialogShow }) => {

  const handleCloseDialog = (event) => {
    const checked = event.target.checked;
    localStorage.setItem("dialog", JSON.stringify(!checked))
  };

  return (
    <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center z-[999] transition-all duration-300 ease-in-out ${
      isDialogShow ? "visible opacity-100" : "invisible opacity-0"
    }`}>
      <div className="max-w-[800px] w-full bg-white fixed z-10 flex items-center sm:max-w-[350px]">
        <button 
          className="absolute -top-10 -right-10 bg-transparent text-4xl sm:top-0 sm:right-0 sm:text-3xl" 
          onClick={() => setIsDialogShow(false)}
        >
          <i className="bi bi-x"></i>
        </button>
        <div className="flex sm:hidden">
          <img src="/img/modal-dialog.jpg" alt="" />
        </div>
        <div className="p-8 text-center">
          <div>
            <h3 className="text-3xl font-medium">NEWSLETTER</h3>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-2.5">
            Sign up to our newsletter and get exclusive deals you won find any
            where else straight to your inbox!
          </p>
          <form className="flex flex-col gap-5 mt-10">
            <input type="text" placeholder="Enter Email Address Here" className="px-4 py-2 border border-gray-300 rounded" />
            <button className="btn btn-primary">SUBSCRIBE</button>
            <label className="flex items-center justify-center gap-1.5 text-sm">
              <input type="checkbox" onChange={handleCloseDialog} />
              <span>Don`t show this popup again</span>
            </label>
          </form>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsDialogShow(false)}
      ></div>
    </div>
  );
};

export default Dialog;

Dialog.propTypes = {
  isDialogShow: PropTypes.bool,
  setIsDialogShow: PropTypes.func,
};