import React from "react";
import RouteForm from "./RouteForm";

export default function AddRouteModal({show,onClose,onSubmit}) {

    return (
        <div className={`modal fade ${show ?"show d-block":""}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Route</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <RouteForm route = {null} onSubmit={onSubmit} onCancel={onClose} />
                    </div>
                </div>
            </div>
        </div>
    );
}