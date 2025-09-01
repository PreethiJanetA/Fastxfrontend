import React,{useState,useEffect} from "react";
import{toast} from "react-toastify";

export default function BusForm({bus,onSubmit,onCancel}){
    const[form,setForm] = useState({
        busName:"",
        busNumber:"",
        busType:"",
        TotalSeats:"",
        amenities:""
    });

    const[errors,setErrors]= useState({});
    const[touched,setTouched] = useState({});

    useEffect(()=>{
        if(bus){
            setForm(bus);
            setErrors({});
            setTouched({});
        }
    },[bus]);

    const handleChange = (e) =>{
        const{name,value} = e.target;
        const updatedValue = name ==="totalSeats"? parseInt(value):value;

        setForm((prev) => ({...prev,[name]:updatedValue}));

        if(touched[name]){
            const error = validateField(name,updatedValue);
            setErrors((prev) =>({...prev,[name]:error}));
        }
    };

    const handleBlur = (e) => {
        const{name,value} = e.target;
        setTouched((prev) => ({...prev,[name]:true}));
        const error = validateField(name,value);
        setErrors((prev) => ({...prev,[name]:error}));
    };

    const validateField = (name,value) => {
        let error = "";

        switch(name){
            case"busName":
              if(!value.trim()) error = "Bus name is required";
               else if (value.length >100) error = "bus name must not exceed 100 characters";
            break;

            case"busNumber":
             const numberRegex = /^[A-Z]{2}-?\d{2}-?[A-Z]{1,2}-?\d{4}$/;
             if(!value.trim()) error = "bus Number is required";
             else if (!numberRegex.test(value)) error = "Enter a valid bus number (e.g ., TN-01-AB-4532).";
            break;

            case"busType":
             if(!value.trim()) error = "bus type is required";
             else if (value.length>50) error = "Bus type must not exceed 50 characters";
            break;

            case"totalSeats":
              const seats = parseInt(value);
              if(!value) error = "Total seats is required";
              else if(!(seats >=1 && seats <=1000)) error = "total seats must be between 1 and 1000";
            break;

            case"amenities":
             if(!value.trim()) error = "Amenities are required";
             else if(value.length >255) error = "amenities must not exceed 255 characters";
            break;
            default:
                break;

        }
        return error;
    };

    const validateForm = () =>{
        const newErrors = {};
        let isValid = true;

        Object.keys(form).forEach((key) =>{
            const error = validateField(key,form[key]);
            if(error){
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({
            busName:true,
            busNumber:true,
            busType:true,
            TotalSeats:true,
            amenities:true
        });

        return isValid;
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!validateForm()){
            toast.error("Please fix the validation errors");
            return;
        }
        onSubmit(form);
        //toast.success("bus saved successfully!");
        resetForm();
    };

    const handleCancel =() =>{
        resetForm();
        onCancel();
    };

    const resetForm = () =>{
        setForm({
            busName:"",
            busNumber:"",
            busType:"",
            TotalSeats:"",
            amenities:""
        });
        setErrors({});
        setTouched({});
    };

    return(
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <div>
                <input
                name="busName"
                placeholder="Bus Name"
                value={form.busName || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                />

                {touched.busName && errors.busName &&(
                    <div className="text-danger">{errors.busName}</div>
                )}
            </div>

            <div>
                <input
                name="busNumber"
                placeholder="Bus Number"
                value = {form.busNumber || ''}
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
                value = {form.busType || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                />
                {touched.busType && errors.busType && (
                    <div className="text-danger">{errors.busType}</div>
                )}
            </div>

            <div>
                <input
                name="TotalSeats"
                type ="number"
                placeholder="Total Seats"
                value={form.TotalSeats || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                />

                {touched.TotalSeats && errors.TotalSeats && (
                    <div className="text-danger">{errors.TotalSeats}</div>
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

            <div className="text-end">
                <button type = "submit" className="btn btn-primary me-2">Save</button>
                <button type="button" className="btn btn-secondary"onClick={handleCancel}>Cancel</button>
            </div>
        </form>

    );
}