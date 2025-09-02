import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRoutes } from "../services/routeService";
import { toast } from "react-toastify";

export default function SearchRoutes() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(""); // datetime-local
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const cityRegex = /^[A-Za-z\s]{2,100}$/;

  const validateField = (name, value) => {
    switch (name) {
      case "origin":
        if (!value.trim()) return "Origin is required.";
        if (!cityRegex.test(value)) return "Only letters allowed (2–100 characters).";
        break;
      case "destination":
        if (!value.trim()) return "Destination is required.";
        if (!cityRegex.test(value)) return "Only letters allowed (2–100 characters).";
        break;
      case "date":
        if (!value) return "Date and time is required.";
        break;
      default:
        break;
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "origin") setOrigin(value);
    else if (name === "destination") setDestination(value);
    else if (name === "date") setDate(value);

    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const validateForm = () => {
    const fields = { origin, destination, date };
    const errors = {};

    for (let key in fields) {
      const errorMsg = validateField(key, fields[key]);
      if (errorMsg) errors[key] = errorMsg;
    }

    setFieldErrors(errors);
    setTouched({ origin: true, destination: true, date: true });

    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setRoutes([]);

    if (!validateForm()) return;

    try {
     
      // const formattedDate = new Date(date).toISOString();
      const formattedDate = date.split("T")[0]; 

      const data = await searchRoutes(origin, destination, formattedDate);

      
      const routesData = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : [];

      if (!routesData.length) {
        setError("No routes found for the selected origin, destination, and date/time.");
        toast.warning("No routes found.");
      } else {
        setRoutes(routesData);
        setError("");
        toast.success(`${routesData.length} route(s) found`);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      toast.error("Server error while fetching routes.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-center mb-4">Search Bus Routes</h3>

        <form onSubmit={handleSearch} noValidate>
          <div className="mb-3">
            <input
              type="text"
              name="origin"
              className="form-control"
              placeholder="Origin"
              value={origin}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.origin && fieldErrors.origin && (
              <small className="text-danger">{fieldErrors.origin}</small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="destination"
              className="form-control"
              placeholder="Destination"
              value={destination}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.destination && fieldErrors.destination && (
              <small className="text-danger">{fieldErrors.destination}</small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="datetime-local"
              name="date"
              className="form-control"
              value={date}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().slice(0,16)}
            />
            {touched.date && fieldErrors.date && (
              <small className="text-danger">{fieldErrors.date}</small>
            )}
          </div>

          <button className="btn btn-warning w-100" type="submit">
            Search
          </button>
        </form>

        {error && routes.length === 0 && (
          <div className="alert alert-warning text-center mt-3">
            😕 {error}
            <br />
            <small>Please try different values or check for spelling mistakes.</small>
          </div>
        )}

        {routes.length > 0 && (
          <div className="mt-4 bg-light text-dark rounded p-3">
            <h5 className="text-center mb-3">Available Routes</h5>
            <ul className="list-group">
              {routes.map((route) => {
                const now = new Date();
                const depTime = new Date(route.departureTime);
                const isToday = depTime.toDateString() === now.toDateString();
                const isPast = depTime < now;
                const isDisabled = isToday && isPast;

                return (
                  <li
                    key={route.routeId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>
                        {route.origin} ➝ {route.destination}
                      </strong>
                      <br />
                      <small>Bus: {route.busName}</small>
                      <br />
                      <small>BusType: {route.busType}</small>
                      <br />
                      <small>Amenities: {route.amenities}</small>
                      <br />
                      <small>Fare: ₹{route.fare}</small>
                      <br />
                      {/* <small>
                        Departure: {new Date(route.departureTime).toLocaleString()}
                      </small> */}
                    </div>
                    <div>
                      <button
                        className="btn btn-success"
                        onClick={() => navigate(`/view-seats/${route.routeId}`)}
                        disabled={isDisabled}
                      >
                        Book
                      </button>
                      {isDisabled && (
                        <div className="text-danger mt-1 small">
                          Departure time has already passed.
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
