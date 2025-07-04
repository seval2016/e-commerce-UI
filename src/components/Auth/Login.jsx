import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Giriş başarılı.");
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate("/");
        }
      } else {
        message.error("Giriş başarısız.");
      }
    } catch (error) {
      console.log("Giriş hatası:", error);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-xl font-medium">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2.5">
        <div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              Username or email address <span className="text-red-600 font-bold">*</span>
            </span>
            <input 
              type="text" 
              name="email" 
              onChange={handleInputChange}
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
              name="password"
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="flex flex-col items-start text-xs">
          <label className="flex items-center gap-1">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button className="btn btn-sm bg-red-600 text-white border-red-600 mt-2.5">Login</button>
        </div>
        <a href="#" className="text-red-600 text-sm">
          Lost your password?
        </a>
      </form>
    </div>
  );
};

export default Login;