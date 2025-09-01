import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { toast } from "react-toastify";

export default function ForgotPassword(){
    const[email,setEmail]= useState("")
    const[newPassword,setNewPassword] = useState("");

    const handleSubmit = async()=>{
        if(!email || !newPassword){
            toast.warn("Please fill all fields");
            return;
        }

        try{
            const res = await forgotPassword({email,newPassword});
            toast.success(res.message);
        }
        catch(err)
        {
            toast.error(err.response?.data?.message || "Reset failed");
        }
    };

    return(
        <div
          style={{
            minHeight: "100vh",
            width:"100vw",
            backgroundImage:"url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')",
            backgroundSize:"cover",
            backgroundPosition:"center",
            padding:"2rem",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            }}
        >

        <div
         className="p-4"
         style={{
            backgroundColor:"rgba (0,0,0,0.7)",
            borderRadius:"16px",
            color:"#fff",
            width:"100%",
            maxWidth:"400px",
            padding:"40px",
            backdropFilter:"blur(10px)",
         }}
        >

            <h2 className="text-center mb-4" style={{fontSize:"24px"}}>Forgot Password</h2>
            <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{width:"120px"}}>Email:</label>
                <input 
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                
            />
            </div>

            <div className="mb-4 d-flex align-items-center">
                 <label className="me-2" style={{width:"120px"}}>New Password:</label>
                <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e)=> setNewPassword(e.target.value)}
            />
            </div>

        <div className="text-center mt-4">
            <button
            onClick={handleSubmit}
            className="btn btn-primary w-100"

            >
            Reset Password
            </button>
         </div>
      </div>
    </div>


    );


}