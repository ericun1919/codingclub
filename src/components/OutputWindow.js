import React from "react";
import { useTranslation, Trans } from 'react-i18next';
const OutputWindow = ({ compileOutputDetails }) => {
  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } 
  const getOutput = () => {
    let statusId = compileOutputDetails?.status?.id;
    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-lg text-red-500">
          {b64DecodeUnicode(compileOutputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return ( 
        <pre className="px-2 py-1 font-normal text-lg text-green-500">
          {compileOutputDetails.stdout !== null
            ? `${b64DecodeUnicode(compileOutputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-lg text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else if (statusId === 4) {
      return(<pre></pre>);
    }else {
      return (
        <pre className="px-2 py-1 font-normal text-lg text-red-500">
          {b64DecodeUnicode(compileOutputDetails?.stderr) || ''}
        </pre>
      );
    }
  };
  return (
    <div  className="w-[70%]">
      <div style={{ height:"5vh"}} className="flex">
        <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-auto mt-auto">
          <Trans>Output</Trans>
        </h1>
      </div>

      <div style={{height: "29vh"}} className="w-full bg-[#1e293b] rounded-md text-white font-normal text-lg overflow-y-auto">
        {compileOutputDetails ? <>{getOutput()}</> : null}
      </div>
    </div>
  );
};

export default OutputWindow;
