import { useState } from "react";
import { parseText } from "../lib/parser";
import "../styles/input_box.scss";

export const InputBox = () => {
    const [value, setValue] = useState<string>("");
    const [focused, setFocused] = useState<boolean>(false);

    return (
        <input 
            type="text"
            className={`input__box ${focused ? "focused" : ""}`}
            value={value} 
            onChange={
                (event: any) => {
                    setValue(event.target.value);
                }
            }
            onFocus={
                (event: any) => {
                    setFocused(true);
                }
            }
            onBlur={
                (event: any) => {
                    setFocused(false);
                    setValue(event.target.value);
                }
            }
        />
    );
    // ) : (
    //     <div
    //         className={`input__box input__box--unfocused`}
    //         onClick={
    //             (event: any) => {
    //                 setFocused(true);
    //             }
    //         }
    //     >{parseText(value)}</div>
    // )
}