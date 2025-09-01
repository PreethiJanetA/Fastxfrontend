import React,{useState,useEffect} from "react";
import{toast} from "react-toastify";

export default function RouteForm({route,onSubmit,onCancel}){
    const[form,setForm] = useState({
        origin:"",
        destination:"",
        departureTime:"",
        arrivalTime:"",
        fare:"",
        busId:""
    });

    const[errors,setErrors] = useState({});
    const[touched,setTouched] = useState({});

    useEffect(()=>{
        if(route){
            setForm(route);
            setErrors({});
            setTouched({});
        }
    },[route]);

    const handleChange = (e) => {
        const{name,value} = e.target;
        setForm((prev)=>({...prev,[name]:value}));

        if(touched[name]){
            const error = validateField(name,value);
            setErrors((prev) =>({...prev,[name]:error}));
        }
    };

    const handleBlur =(e) =>{
        const{name,value} = e.target;
        setTouched((prev) => ({...prev,[name]:true}));
        const error = validateField(name,value);
        setErrors((prev) => ({...prev,[name]:error}));
    };

    const validateField = (name,value) =>{
        let error = "";

        switch(name){
            case"origin":
             if(!value.trim()) error = "origin is required";
             else if(value.length >100) error = "origin must not exceed 100 characters";
            break;

            case"destination":
             if(!value.trim()) error = "destination is required";
             else if(value.length >100) error = "destination must not exceed 100 characters";
            break;

            case"departureTime":
            case"arrivalTime":
            if(!form.departureTime || !form.arrivalTime){
                error = "both departure and arrival tim are required";
            }else{
                const dep = new Date(form.departureTime);
                const arr = new Date(form.arrivalTime);
                if(dep.toISOString()===arr.toISOString()){
                    error = "Departure and arrival time cannot be same";
                }else if(arr<=dep){
                    error = "arrival time must be after departure time";
                }
            }
            break;

            case"fare":
             if(!value)error = "fare is required";
             else if(parseFloat(value)<=0)error = "fare must be greater than 0";
            break;

            case"busId":
             if(!value)error  = "bus Id is required";
             else if(parseInt(value)<1)error = "BusId must be a positive number";
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
            origin:true,
            destination:true,
            departureTime:true,
            arrivalTime:true,
            fare:true,
            busId:true
        });

        return isValid;
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(!validateForm()){
            toast.error("please fix the validation error");
            return;
        }

        const data = {
            ...form,
            fare:parseFloat(form.fare),
            busId:parseInt(form.busId)
        };

        onSubmit(data);
        toast.success("route saved successfully");
        resetForm();
    };

    const handleCancel = () =>{
        resetForm();
        onCancel();
    };

    const resetForm = () =>{
        setForm({
            origin:"",
            destination:"",
            departureTime:"",
            arrivalTime:"",
            fare:"",
            busId:""
        });
        setErrors({});
        setTouched({});
    };

    const getMinDateTime = () =>{
        const now = new Date();
        now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
        return now.toISOString().slice(0,16);
    };

    return(
        <form onSubmit={handleSubmit} className="d-flex flex-column gsp-2">
            <div>
                <input
                  name="origin"
                  placeholder="origin"
                  value={form.origin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-control"
                  />
                  {touched.origin && errors.origin && <div className="text-danger">{errors.origin}</div>}

            </div>

            <div>
                <input
                name="destination"
                placeholder="Destination"
                value={form.destination}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control"

                />

                {touched.destination && errors.destination &&(
                    <div className="text-danger">{errors.destination}</div>
                )}
            </div>

            <div>
                <input
                name = "departureTime"
                type="datetime-local"
                value={form.departureTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min={getMinDateTime()}
                className="form-control"
                />

                {touched.departureTime && errors.departureTime && (
                    <div className="text-danger">{errors.departureTime}</div>
                )}
            </div>

            <div>
                <input
                name="arrivalTime"
                type="datetime-local"
                value={form.arrivalTime}
                onChange={handleChange}
                onBlur={handleBlur}
                min = {form.departureTime || getMinDateTime()}
                className="form-control"

                />
                {touched.arrivalTime && errors.arrivalTime && (
                    <div className="text-danger">{errors.arrivalTime}</div>
                )}
            </div>

            <div>
                <input
                name = "fare"
                type="number"
                placeholder="Fare"
                value = {form.fare}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control"
                />

                {touched.fare && errors.fare && <div className="text-danger">{errors.fare}</div>}
            </div>

            <div>
                <input
                name="busId"
                type="number"
                placeholder="Bus ID"
                value={form.busId}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control"

                />

                {touched.busId && errors.busId && <div className="text-danger">{errors.busId}</div>}
            </div>
            <div className="text-end">
                <button type="submit" className="btn btn-primary me-2">Save</button>
                <button type="button"className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
}