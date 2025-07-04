import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // const { password, ...rest } = data;
        
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Kayıt başarılı.");
        navigate("/");
      } else {
        message.error("Kayıt başarısız.");
      }
    } catch (error) {
      console.log("Giriş hatası:", error);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-xl font-medium">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-2.5">
        <div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              Username <span className="text-red-600 font-bold">*</span>
            </span>
            <input 
              type="text" 
              onChange={handleInputChange} 
              name="username"
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              Email address <span className="text-red-600 font-bold">*</span>
            </span>
            <input 
              type="email" 
              onChange={handleInputChange} 
              name="email"
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              Password <span className="text-red-600 font-bold">*</span>
            </span>
            <input
              type="password"
              onChange={handleInputChange}
              name="password"
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="flex flex-col items-start text-xs">
          <p>
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our <a href="#" className="text-red-600">privacy policy.</a>
          </p>
          <button className="btn btn-sm bg-red-600 text-white border-red-600 mt-2.5">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;