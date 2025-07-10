import PropTypes from "prop-types";
import Button from "../../common/Button";
import Input from "../../common/Input";
import Modal from "../../common/Modal";
import { images } from "../../../utils/imageImports";

const Dialog = ({ isDialogShow, setIsDialogShow }) => {

  const handleCloseDialog = (event) => {
    const checked = event.target.checked;
    localStorage.setItem("dialog", JSON.stringify(!checked))
  };

  return (
    <Modal 
      isOpen={isDialogShow} 
      onClose={() => setIsDialogShow(false)}
      size="2xl"
      className="flex items-center sm:flex-col"
    >
      <div className="flex sm:hidden">
        <img src={images.modalDialog} alt="" />
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
          <Input type="email" placeholder="Enter Email Address Here" size="md" fullWidth />
          <Button variant="primary" size="md">SUBSCRIBE</Button>
          <label className="flex items-center justify-center gap-1.5 text-sm">
            <input type="checkbox" onChange={handleCloseDialog} />
            <span>Don`t show this popup again</span>
          </label>
        </form>
      </div>
    </Modal>
  );
};

export default Dialog;

Dialog.propTypes = {
  isDialogShow: PropTypes.bool,
  setIsDialogShow: PropTypes.func,
};