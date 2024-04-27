import React from "react";
//import "./text.css";
import { useTheme } from "@/hooks/theme";

const CardTextSvg = (props) => {
  const { darkMode } = useTheme();
  return (
    <svg
      id="ehALe6vE7PQ1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 16 16"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      width="1.1rem"
      height="1.1rem"
      fill={darkMode ? `#f3f4f6` : `#6B7280`}
      {...props}
    >
      <style>
        {`
      #ehALe6vE7PQ3 { animation: ehALe6vE7PQ3_c_o 2000ms linear infinite normal forwards; }
      @keyframes ehALe6vE7PQ3_c_o { 0% { opacity: 0 } 30% { opacity: 1 } 100% { opacity: 1 } }
      #ehALe6vE7PQ4 { animation: ehALe6vE7PQ4_c_o 2000ms linear infinite normal forwards; }
      @keyframes ehALe6vE7PQ4_c_o { 0% { opacity: 0 } 30% { opacity: 0 } 60% { opacity: 1 } 100% { opacity: 1 } }
      #ehALe6vE7PQ5 { animation: ehALe6vE7PQ5_c_o 2000ms linear infinite normal forwards; }
      @keyframes ehALe6vE7PQ5_c_o { 0% { opacity: 0 } 60% { opacity: 0 } 90% { opacity: 1 } 100% { opacity: 1 } }
    `}
      </style>
      <path
        d="M14.5,3c.276142,0,.5.223858.5.5v9c0,.276142-.223858.5-.5.5h-13c-.276142,0-.5-.223858-.5-.5v-9c0-.276142.223858-.5.5-.5h13ZM1.5,2C0.671573,2,0,2.671573,0,3.5v9c0,.828427.671573,1.5,1.5,1.5h13c.828427,0,1.5-.671573,1.5-1.5v-9c0-.828427-.671573-1.5-1.5-1.5h-13Z"
        transform="translate(.035912 0)"
      />
      <path
        id="ehALe6vE7PQ3"
        d="M3,5.5c0-.276142.223858-.5.5-.5c0,0,8.711929,0,9,0s.5.223858.5.5-.211929.5-.5.5-9,0-9,0C3.223858,6,3,5.776142,3,5.5"
        transform="translate(0 0.023245)"
      />
      <path
        id="ehALe6vE7PQ4"
        d="M3,5.5c0-.276142.223858-.5.5-.5c0,0,8.711929,0,9,0s.5.223858.5.5-.211929.5-.5.5-9,0-9,0C3.223858,6,3,5.776142,3,5.5"
        transform="translate(0 2.506525)"
      />
      <path
        id="ehALe6vE7PQ5"
        d="M3,10.5c0-.276142.223858-.5.5-.5h6.333333c.276142,0,.5.223858.5.5s-.223858.5-.5.5L3.5,11c-.276142,0-.5-.223858-.5-.5"
        transform="translate(0 0.079334)"
      />
    </svg>
  );
};
export default CardTextSvg;
