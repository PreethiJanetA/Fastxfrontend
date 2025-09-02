import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    contactNumber: "",
    address: "",
    roleId: 1,
    busId: "", 
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const contactRegex = /^[6-9]\d{9}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.length > 100) return "Name cannot exceed 100 characters.";
        break;
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!emailRegex.test(value)) return "Invalid email format.";
        break;
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
       
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        break;
      case "gender":
        if (!value) return "Gender is required.";
        break;
      case "contactNumber":
        if (!value) return "Contact number is required.";
        if (!contactRegex.test(value)) return "Must start with 6-9 and be 10 digits.";
        break;
      case "address":
        if (!value.trim()) return "Address is required.";
        if (value.length > 255) return "Address cannot exceed 255 characters.";
        break;
      case "roleId":
        if (!value) return "Role ID is required.";
        break;
      case "busId":
        if (parseInt(form.roleId, 10) === 3) { 
          if (!value.trim()) return "Bus ID is required for Bus Operators.";
          if (!/^\d+$/.test(value)) return "Bus ID must be numeric.";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    setFieldErrors(newErrors);
    setTouched(
      Object.keys(form).reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        phoneNumber: form.contactNumber,
        address: form.address,
        roleId: parseInt(form.roleId, 10),
        ...(parseInt(form.roleId, 10) === 3 && { busId: parseInt(form.busId, 10) }), 
      };

      await register(payload);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err.message);
      toast.error(err.message || "Registration failed.");
      setError(err.message);
    }
  };
  return (
  <div
    className="position-relative d-flex justify-content-center align-items-center"
    style={{
      height: "90%",
      width: "100vw",
      backgroundColor: "#1ed2ff81",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "2.5rem",
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "550px",
        animation: "fadeIn 0.8s ease-in-out",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <h2
        className="text-center mb-4"
        style={{
          fontWeight: "800",
          fontSize: "2rem",
          background: "linear-gradient(90deg, #007bff, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Create Your FASTX Account 🚍
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {[
          { name: "name", type: "text", placeholder: "Name" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
          { name: "contactNumber", type: "text", placeholder: "Contact Number" },
          { name: "address", type: "text", placeholder: "Address" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              className="form-control"
              style={{
                borderRadius: "10px",
                border: "1px solid #007bff",
                padding: "0.75rem",
              }}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched[field.name] && fieldErrors[field.name] && (
              <small className="text-danger">{fieldErrors[field.name]}</small>
            )}
          </div>
        ))}

        <div className="mb-3">
          <select
            name="gender"
            className="form-select"
            style={{ borderRadius: "10px", border: "1px solid #007bff" }}
            value={form.gender}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {touched.gender && fieldErrors.gender && (
            <small className="text-danger">{fieldErrors.gender}</small>
          )}
        </div>

        <div className="mb-3">
          <select
            name="roleId"
            className="form-select"
            style={{ borderRadius: "10px", border: "1px solid #007bff" }}
            value={form.roleId}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value={2}>Admin</option>
            <option value={1}>User</option>
            <option value={3}>Bus Operator</option>
          </select>
          {touched.roleId && fieldErrors.roleId && (
            <small className="text-danger">{fieldErrors.roleId}</small>
          )}
        </div>

        {parseInt(form.roleId, 10) === 3 && (
          <div className="mb-3">
            <input
              type="text"
              name="busId"
              className="form-control"
              style={{
                borderRadius: "10px",
                border: "1px solid #007bff",
                padding: "0.75rem",
              }}
              placeholder="Bus ID"
              value={form.busId}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.busId && fieldErrors.busId && (
              <small className="text-danger">{fieldErrors.busId}</small>
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn w-100"
          style={{
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "#fff",
            fontWeight: "600",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Register
        </button>
      </form>

      {error && <p className="text-danger text-center mt-3">{error}</p>}

      <p className="text-center mt-4">
        Already a user?{" "}
        <a href="/" style={{ color: "#007bff", fontWeight: "600" }}>
          Login here
        </a>
      </p>
    </div>
  </div>
);

};

export default Register;

