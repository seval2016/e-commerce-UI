import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  return (
    <section className="my-15">
      <div className="container">
        <div className="flex justify-between gap-8 md:flex-col">
          <Login />
          <Register />
        </div>
      </div>
    </section>
  );
};

export default Auth;
