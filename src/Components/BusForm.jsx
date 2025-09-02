import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function BusForm({ bus, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        busName: "",
        busNumber: "",
        busType: "",
        totalSeats: "",
        amenities: "",
        busOperatorId: "", // Change initial state to a number or empty string
        isAvailable: true 
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // This effect ensures the form is populated correctly for editing existing buses.
    useEffect(() => {
        if (bus) {
            setForm(bus);
            setErrors({});
            setTouched({});
        }
    }, [bus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert both totalSeats and busOperatorId to a number
        const updatedValue = name === "totalSeats" || name === "busOperatorId" ? parseInt(value) || 0 : value;

        setForm((prev) => ({ ...prev, [name]: updatedValue }));

        if (touched[name]) {
            const error = validateField(name, updatedValue);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "busName":
                if (!value.trim()) error = "Bus name is required";
                else if (value.length > 100) error = "Bus name must not exceed 100 characters";
                break;
            case "busNumber":
                const numberRegex = /^[A-Z]{2}-?\d{2}-?[A-Z]{1,2}-?\d{4}$/;
                if (!value.trim()) error = "Bus Number is required";
                else if (!numberRegex.test(value)) error = "Enter a valid bus number (e.g., TN-01-AB-4532).";
                break;
            case "busType":
                if (!value.trim()) error = "Bus type is required";
                else if (value.length > 50) error = "Bus type must not exceed 50 characters";
                break;
            case "totalSeats":
                const seats = parseInt(value);
                if (!value) error = "Total seats is required";
                else if (!(seats >= 1 && seats <= 1000)) error = "Total seats must be between 1 and 1000";
                break;
            case "amenities":
                if (!value.trim()) error = "Amenities are required";
                else if (value.length > 255) error = "Amenities must not exceed 255 characters";
                break;
            case "busOperatorId":
                const operatorId = parseInt(value);
                if (!value) error = "Bus Operator ID is required";
                else if (isNaN(operatorId) || operatorId <= 0) error = "Enter a valid Bus Operator ID";
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({
            busName: true,
            busNumber: true,
            busType: true,
            totalSeats: true,
            amenities: true,
            busOperatorId: true
        });
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }
        onSubmit(form);
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const resetForm = () => {
        setForm({
            busName: "",
            busNumber: "",
            busType: "",
            totalSeats: "",
            amenities: "",
            busOperatorId: "",
            isAvailable: true
        });
        setErrors({});
        setTouched({});
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <div>
                <input
                    name="busName"
                    placeholder="Bus Name"
                    value={form.busName || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.busName && errors.busName && (
                    <div className="text-danger">{errors.busName}</div>
                )}
            </div>
            <div>
                <input
                    name="busNumber"
                    placeholder="Bus Number"
                    value={form.busNumber || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.busNumber && errors.busNumber && (
                    <div className="text-danger">{errors.busNumber}</div>
                )}
            </div>
            <div>
                <input
                    name="busType"
                    placeholder="Bus Type"
                    value={form.busType || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.busType && errors.busType && (
                    <div className="text-danger">{errors.busType}</div>
                )}
            </div>
            <div>
                <input
                    name="totalSeats"
                    type="number"
                    placeholder="Total Seats"
                    value={form.totalSeats || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.totalSeats && errors.totalSeats && (
                    <div className="text-danger">{errors.totalSeats}</div>
                )}
            </div>
            <div>
                <input
                    name="amenities"
                    placeholder="Amenities"
                    value={form.amenities || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.amenities && errors.amenities && (
                    <div className="text-danger">{errors.amenities}</div>
                )}
            </div>
            <div>
                <input
                    name="busOperatorId"
                    type="number"
                    placeholder="Bus Operator ID"
                    value={form.busOperatorId || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched.busOperatorId && errors.busOperatorId && (
                    <div className="text-danger">{errors.busOperatorId}</div>
                )}
            </div>
            <div className="text-end">
                <button type="submit" className="btn btn-primary me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
}