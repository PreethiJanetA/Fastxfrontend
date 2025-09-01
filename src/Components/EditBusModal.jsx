import React from "react";
import BusForm from "./BusForm";

export default function EditBusModal({show,bus,onClose,onSubmit}){
    return(
        <div className={` modal fade${show ?"show d-block":""}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Bus</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <BusForm bus = {bus} onSubmit={onSubmit} onCancel={onClose}/>
                    </div>
                </div>
            </div>
        </div>
    );
}