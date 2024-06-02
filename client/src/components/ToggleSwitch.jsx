import { useState } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import "../css/ToggleSwitch.css";

export default function ToggleSwitch({ checked, onChange }) {
    const [isChecked, setIsChecked] = useState(checked);

    const handleToggle = () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        onChange(newChecked);
    };

    return (
        <div className={`toggle-switch ${isChecked ? "checked" : ''}`} onClick={handleToggle}>
            <div className="toggle-switch-inner">
                <IoCheckmarkCircle className={`toggle-icon checked-icon ${isChecked === false ? 'hidden' : ''}`} />
                <IoCloseCircle className={`toggle-icon unchecked-icon ${isChecked ? 'hidden' : ''}`} />
            </div>
        </div>
    );
};
