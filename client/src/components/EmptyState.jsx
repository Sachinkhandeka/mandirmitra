import React from "react";
import { TbFaceIdError } from "react-icons/tb";

export default function EmptyState({ message }) {
    return (
        <div className="flex justify-center items-center my-28">
            <div className="text-center flex flex-col items-center justify-center">
                <TbFaceIdError size={50} className="animate-bounce" />
                <p>{message}</p>
            </div>
        </div>
    );
}
