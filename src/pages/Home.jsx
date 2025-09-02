import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, login } from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAutoLogout } from "../utils/authUtils";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { auth, loginUser } = useAuth();

  useEffect(() => {
    if (auth.isLoggedIn) {
      const role = localStorage.getItem("role");
      if (role === "Admin") navigate("/admin");
      else if (role === "User") navigate("/user/dashboard");
      else if (role === "Bus Operator") navigate("/bus-operator/dashboard");
    }
  }, [auth.isLoggedIn, navigate]);

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (name === "email") {
      if (!value) return "Email is required.";
      else if (!emailRegex.test(value)) return "Enter a valid email address.";
      else if (value.length > 100) return "Email must be at most 100 characters.";
    }

    if (name === "password") {
      if (!value) return "Password is required.";
      else if (value.length < 8)
        return "Password must be at least 6 characters.";
      else if (value.length > 100)
        return "Password must be at most 100 characters.";
    }

    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !newErrors.email && !newErrors.password;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Enter the correct credentials.");
      return;
    }

    try {
      const role = await login({ email, password });
      loginUser();
      toast.success("Login successful!");

      const token = localStorage.getItem("token");
      if (token) {
        setAutoLogout(token);
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };
return (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(-45deg, #1e3c72, #2a5298, #6dabedff, #2193b0)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {!auth.isLoggedIn && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            padding: "2rem",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            animation: "fadeIn 1s ease-out",
            height : "95%",
          }}
        >
            <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "1.5rem",
      fontWeight: "bold",
      fontFamily: "'Playfair Display', serif", // A more aesthetic font style
      color: "#212529", // Keeping it dark for contrast
      marginBottom: "0.5rem",
    }}
  >
     Welcome to FASTX 🚌
  </h2>
  <p
  className="text-center mb-4"
  style={{
    fontSize: "1rem",
    fontWeight: "600",
    color: "#007bff",
    fontFamily: "'Poppins', sans-serif",
    textShadow: "2px 2px 6px rgba(0, 123, 255, 0.3)",
    letterSpacing: "0.5px",
  }}
>
  ✨ Your journey, your way. Let’s go. ✨
</p>
</div>

          <h4 className="mb-3 text-center fw-bold">Login</h4>
          <form onSubmit={handleLoginSubmit} noValidate>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${
                  touched.email && errors.email ? "is-invalid" : ""
                }`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    const error = validateField("email", e.target.value);
                    setErrors((prev) => ({ ...prev, email: error }));
                  }
                }}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${
                  touched.password && errors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    const error = validateField("password", e.target.value);
                    setErrors((prev) => ({ ...prev, password: error }));
                  }
                }}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="text-center mt-3">
            <a href="/forgot-password" style={{ fontSize: "1rem" }}>
              Forgot Password?
            </a>
          </p>
          <p className="text-center">
            New user? <a href="/register">Register here</a>
          </p>
        </div>
      )}
    </div>

    <ToastContainer position="top-right" autoClose={3000} />
  </>
);

}