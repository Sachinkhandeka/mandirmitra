import { useEffect, useRef, useState } from "react";

export default function OtpInput({ length, onOtpSubmit,  }) {
    const [ otp, setOtp ] = useState(new Array(length).fill(""));
    const inputRefs =  useRef([]);

    useEffect(()=> {
        if(inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    },[])

    const handleChange = (e,  indx)=> {
        const { value }  =  e.target ; 

        if(isNaN(value)) {
            return ;
        }

        const newOtp = [ ...otp];

        //allow only one
        newOtp[indx] = value.substring(value.length - 1);
        setOtp(newOtp);

        //submit trigger
        const  combinedOtp = newOtp.join("");

        if(combinedOtp.length  === length)  {
            onOtpSubmit(combinedOtp);
        }

        //move to the next input  if current field is filled
        if(value && indx < length - 1 && inputRefs.current[indx + 1]) {
            inputRefs.current[indx + 1].focus();
        }
    }
    const handleClick = (indx)=> {
        inputRefs.current[indx].setSelectionRange(1,1);

        if(indx >= 0 && !otp[indx - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }

        if(indx < length && !otp[indx + 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    }

    const handleKeyDown = (e, indx)=> {
        //move to the previous input  field on  backspace
        if(e.key === "Backspace" && !otp[indx] && indx > 0 && inputRefs.current[indx - 1]) {
            inputRefs.current[indx - 1].focus();
        }
    }
    return (
        <>
            <div className={`grid grid-cols-6 gap-2 max-w-72`} >
                { otp.map((val, indx)=> {
                    return (
                        <input 
                            type="text" 
                            name="otp-input" 
                            id="otp-input"
                            ref={(input)=> (inputRefs.current[indx] = input)}
                            key={indx} 
                            value={val}
                            onChange={(e)=> handleChange(e, indx)}
                            onClick={()=> handleClick(indx)}
                            onKeyDown={(e)=> handleKeyDown(e, indx)}
                            className="bg-transparent rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )
                }) }
            </div>
        </>
    );
}