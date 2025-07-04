import ReactDOM from "react-dom/client";
import App from "./App";
import Layout from "./layouts/Layout";
import CartProvider from "./context/CartProvider";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <Layout>
        <App />
      </Layout>
    </CartProvider>
  </BrowserRouter>
);
