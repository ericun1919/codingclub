import React from "react";
import { classnames } from "../utils/general";
import { useTranslation, Trans } from 'react-i18next';

const CustomInput = ({ customInput, setCustomInput, sendData, processing, code}) => {
  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    if(!str){
      return ('')
    }
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } 
  
  return (
    <>
      <div style={{ height:"5vh"}} className="flex justify-between ">
        <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-auto mt-auto">
          <Trans>Custom Input</Trans>
        </h1>
        <button
            onClick={sendData}
            disabled={!code || processing}
            className={classnames(
              "bg-green-300 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center mt-auto mb-auto",
              !code || processing? "opacity-50" : ""
            )}
          >
              {<img className ='fill-current w-4 h-4 mr-2'src={process.env.PUBLIC_URL  + `/compile.png`}></img>}
              <span><Trans>Run</Trans></span>
            
        </button>
      </div>

      <textarea
        style={{ height:"29vh"}}
        rows= "8"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        // placeholder={testcase[0]? b64DecodeUnicode(testcase[0].input_base64) : ''}
        className={classnames(
          // "focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
          "focus:outline-none w-[100%] border-2 border-black z-10 rounded-md px-2 py-2 text-lg relative"
        )}
      >
      </textarea>


    </>
  );
};

export default CustomInput;
