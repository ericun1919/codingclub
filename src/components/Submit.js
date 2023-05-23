import React from "react";
import { useEffect, useState } from "react";
import { CAccordionBody } from '@coreui/react';
import { CAccordionHeader } from '@coreui/react';
import { CAccordionItem } from '@coreui/react';
import { CAccordion } from '@coreui/react';
import { classnames } from "../utils/general";
import { useTranslation, Trans } from 'react-i18next';
const Submit = ({ testcase ,code, handleSubmit, submitOutputDetails, submitting, handleExpand}) => {
    const { t, i18n } = useTranslation();
    const [tc, setTc] = useState(null);
    const switchTestcase = (i) =>{
        if (tc && tc === testcase[i]){
            setTc(null);
        } else{
            setTc(testcase[i]);
        }
    }

    async function copyTextToClipboard() {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(b64DecodeUnicode(tc.input_base64));
        } else {
          return document.execCommand('copy', true, b64DecodeUnicode(tc.input_base64));
        }
    }

    function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    const getTestcase = () =>{
        return(
            <div className = "flex flex-col">
                <br></br>

                <div className= "flex justify-between font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    <div>
                        <Trans>Input</Trans>
                    </div>
                    {tc.visible?<div>
                        <button onClick={copyTextToClipboard}>
                            <img className ='h-5 inline-block mb-1' src={process.env.PUBLIC_URL  + `/copy.png`}></img>
                        </button>
                    </div>:""}

                </div>
                <pre className="px-2 py-2 w-full h-24 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
                    <Trans>{tc.visible? b64DecodeUnicode(tc.input_base64): 'Hidden'}</Trans>
                </pre>
                <br></br>
                <div className= "font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    <Trans>Output</Trans>
                </div>
                <pre className="px-2 py-2  w-full h-24 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
                    <Trans>{tc.visible? b64DecodeUnicode(tc.output_base64): 'Hidden'}</Trans>
                </pre>
                <br></br>
                <pre className="w-full font-normal text-base">
                    <Trans>{tc.visible? b64DecodeUnicode(tc.description_base64): 'Hidden'}</Trans>
                </pre>
                <div className= "font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    <Trans>Status</Trans>
                </div>
                <div>
                    <Trans>{submitOutputDetails.length > 0 ? submitOutputDetails[testcase.indexOf(tc)].status?.description : "-"}</Trans>
                </div>
            </div>
        )
    }
    return (
        <CAccordionItem itemKey={3}>
            <CAccordionHeader onClick={handleExpand}><span className="font-bold"><img className ='h-5 inline-block mr-1 mb-1'src={process.env.PUBLIC_URL  + `/submit.png`}></img><Trans>Submit</Trans></span></CAccordionHeader>
                <CAccordionBody>
                <div className=" overflow-y-auto" style={{height:"35rem"}}>
                    
                <div className='flex flex-col '>
                <button
                    onClick={handleSubmit}
                    disabled={!code || submitting} 
                    className={classnames(
                    "ml-auto border-2 border-black z-10 rounded-md px-1 py-2 w-[30%]",
                    !code ? "opacity-50" : ""
                    )}
                >
                    {submitting? <div className="items-center ml-1">{t('Processing')}<img className ='h-5 inline-block mb-1'src={process.env.PUBLIC_URL  + `/processing.gif`}></img></div> : t("Run")}
                </button>
                <br></br>
                <div>
                {testcase.map(t => {
                return (
                    <button
                    onClick={() => switchTestcase(testcase.indexOf(t))}
                    className={classnames(
                    "m-2 border-2 border-black z-10 text-black rounded-md px-1 py-1 w-[25%] cursor-pointer",
                    !code ? "opacity-50" : "",
                    testcase.indexOf(t) === testcase.indexOf(tc)? "bg-slate-200":"",
                    submitOutputDetails.length < 1?  "border-inherit" : submitOutputDetails[testcase.indexOf(t)].status.description === 'Accepted'? "border-lime-600": "border-rose-600",
                    )}
                >
                    {t.visible? <div><Trans>{'Testcase'}</Trans>{testcase.indexOf(t) + 1}</div>:<div className='mr-1'><img className = "h-4 inline-block mb-1"src={process.env.PUBLIC_URL  + `/testcase_hidden.png`}></img><Trans>{'Testcase'}</Trans>{testcase.indexOf(t) + 1}</div>}
                </button>
                );
                })}
                </div>
                </div>
                {(submitOutputDetails && tc) ? <>{getTestcase()}</> : null}
                </div>
            </CAccordionBody>
        </CAccordionItem>

  );
};

export default Submit;