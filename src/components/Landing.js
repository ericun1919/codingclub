import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import LanguagesDropdown from "./LanguagesDropdown";
import ThemeDropdown from "./ThemeDropdown";
import FontSizeDropdown from "./FontSizeDropdown";
import { languageOptions } from "../constants/languageOptions";
import { themeOptions } from "../constants/themeOptions";
import { useTranslation, Trans } from 'react-i18next';
import { Alert } from '@coreui/react';
import { CAccordionBody } from '@coreui/react'
import { CAccordionHeader } from '@coreui/react'
import { CAccordionItem } from '@coreui/react'
import { CAccordion } from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import { classnames } from "../utils/general";
import ReactDOM from 'react-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Submit from "./Submit";
import { useRef } from 'react';
import { redirect } from "react-router-dom";

const RAPID_API_URL = "https://judge0-ce.p.rapidapi.com/submissions"
const RAPID_API_HOST = "judge0-ce.p.rapidapi.com"
const RAPID_API_KEY = "fbe7df1e99msh10f296f62348e88p18ba83jsn4f2f578fb950"
const lngs = {
  zh: { nativeName: 'Chinese' },
  en: { nativeName: 'English' }
};

const Landing = () => {
  const [fontSize, setFontSize] = useState(24);
  const inputArea = document.querySelector('.inputarea');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(themeOptions[1]);
  const { t, i18n } = useTranslation();
  const [submitExpanded, setSubmitExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({pid: -1, user_id: -1, language:'zh'});
  const user_id = searchParams.get('user_id');
  const qid = searchParams.get('pid');
  const lan = searchParams.get('language');
  const [PythonDefault, setPythonDefault] = useState('');
  const [testcase, setTestcase] = useState([]);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [compileOutputDetails, setCompileOutputDetails] = useState(null);
  const [submitOutputDetails, setSubmitOutputDetails] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };
  const onThemeSelectChange = (t1) => {
    setTheme(t1);
  }
  const onFontSizeSelectChange = (fs) => {
    setFontSize(fs.value);
  };

  function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
  }
  React.useEffect(() => {

    if (inputArea){
      inputArea.addEventListener("keydown", keyPress);
      return () => {
        inputArea.removeEventListener("keydown", keyPress);
      };
    }
  });

  const keyPress = (e) =>{
    if (e.key === "Enter" && e.ctrlKey === true ){
      sendData();
      console.log(customInput)
    }
  }

  // const navigate = useNavigate();
  // useEffect(() => {
  //   setInterval(pingServer, 5000);
  //   window.addEventListener("beforeunload", (ev) => 
  //   {  
  //     const options = {
  //       method: "POST",
  //       url: "https://api.bricks.academy/api:dIOXaIX5/online",
  //       data: {
  //           "lastonline": null,
  //           "s_id": 1
  //         },
  //       headers: {
  //       "content-type": "application/json",
  //       },
  //     };
  //     axios
  //     .request(options)
  //     .then(function (response) {
  //       setQuestion(response.data);
  //     })
  //     .catch((err) => {
  //       let error = err.response ? err.response.data : err;
  //       // get error status
  //       console.log("catch block...", error);
  //     });
  //     const date = new Date();
  //     console.log(date);
  //   });
  // }, []);


  
  // function handleRemoveQueryStrings() {
  //   navigate({
  //     pathname: window.location.pathname,
  //     search: '',
  //   });
  // }
  function handleThemeChange(th) {
    const theme = th;

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  
  function pingServer() {
    const date = new Date();
    const options = {
      method: "POST",
      url: "https://api.bricks.academy/api:dIOXaIX5/online",
      data: {
          "lastonline": date,
          "s_id": 2
        },
      headers: {
      "content-type": "application/json",
      },
    };
    axios
    .request(options)
    .then(function (response) {
      //pass
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    });
  }

  useEffect(() => {
    if (user_id > 0 && qid > 0){
      getQuestion();
      getSession();
    }
    i18n.changeLanguage(lan);
    // handleRemoveQueryStrings();
  },[]);
  
  const getSession = () => {
    const options = {
      method: "POST",
      url: 'https://api.bricks.academy/api:session/problem_session',
      data: {
        "user_id": user_id,
        "problem_id": qid
      }
    };
    axios
    .request(options)
    .then(function (response) {
      setPythonDefault(response.data.code);
      setCode(response.data.code);
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    })
  }

  function getQuestion(){
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      url: 'https://api.bricks.academy/api:problem/problem',
      data: {
        "pid": qid
      },
    };
    axios
    .request(options)
    .then(function (response) {
      setTestcase(response.data._testcase);
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    })
  }


  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      sendData();
    }
  }, [ctrlPress, enterPress]);

  useEffect(() =>{
    if (code){
      saveCode();
    }
  },[code]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        setPythonDefault('');
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleSubmit = () => {
    setSubmitOutputDetails([]);
    setSubmitting(true);
    
    let form = []
    
    {testcase.map(t => {
      const newItem = {
        language_id: language.id,
        // encode source code in base64
        expected_output: t.output_base64,
        source_code: b64EncodeUnicode(code),
        stdin: t.input_base64,
      }
      form.push(newItem);
    }
    )}
    console.log(form)
    const formData = {
      submissions: form
    }

    const options = {
      method: "POST",
      url: RAPID_API_URL + '/batch',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        let token = '';
        {response.data.map(d => {
          token = token + d.token + ',';
        })}

        checkStatus_Submit(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `too many requests`,
            10000
          );
        }
        setSubmitting(false);
        console.log("catch block...", error);
      });
  };

  const handleCompile = () => {
    setCompileOutputDetails("");
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: b64EncodeUnicode(code),
      stdin: b64EncodeUnicode(customInput),
    };

    const options = {
      method: "POST",
      url: RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `too many requests`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 1000);
        return;
      } else {
        setProcessing(false);
        setSubmitting(false);
        setCompileOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      setSubmitting(false);
      showErrorToast();
    }
  };

  const checkStatus_Submit = async (token) => {
    const options = {
      method: "GET",
      url: RAPID_API_URL + "/batch",
      params: { tokens: token, base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let data = response.data.submissions;
      let processing = false
      {data.map(d => {
        if (d.status?.id === 1 || d.status?.id === 2){
          processing = true
        }
      })}

      // Processed - we have a result
      if (processing) {
        // still processing
        setTimeout(() => {
          checkStatus_Submit(token);
        }, 1000);
        return;
      } else {

        setProcessing(false);
        setSubmitting(false);
        console.log(response.data.submissions);
        setSubmitOutputDetails(response.data.submissions);
        sendSubmit(response.data.submissions);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      setSubmitting(false);
      showErrorToast();
    }
  };

  useEffect(() => {
    defineTheme("oceanic-next");
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(t(msg || `Compiled Successfully!`), {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const sendSubmit = (submissions) => {
    if (checkSubmitStatus(submissions)){
      console.log(1)
      let submission = submissions[submissions.length - 1]
      const options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        url: 'https://api.bricks.academy/api:problem/problem_submission',
        data: {
          "pid": qid,
          "user_id": user_id,
          "code": code,
          "code_base64": b64EncodeUnicode(code),
          "code_size": code.length,
          "token": submission.token,
          "execution_time": submission.time,
          "execution_memory": submission.memory
        }
      };
      axios
      .request(options)
      .then(function (response) {
        window.top.location.replace("https://www.codingclub.ai/problems");
      })
      .catch((err) => {
        console.log("err", err);
        setProcessing(false);
        showErrorToast();
      })
    }
  }
  const checkSubmitStatus = (submissions)=>{
    console.log(submissions)
    for (let i = 0; i < submissions.length; i++){
      if (submissions[i].status.description !== 'Accepted'){
        return false
      }
    }
    return true
  }
  const showErrorToast = (msg, timer) => {
    toast.error(t(msg || `Something went wrong! Please try again.`), {
      position: "bottom-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const saveCode = () =>{
    const options = {
      method: "POST",
      url: 'https://api.bricks.academy/api:session/problem_session/c',
      data: {
        "user_id": user_id,
        "problem_id": qid,
        "code": code
      }
    };
    axios
    .request(options)
    .then(function (response) {
      //pass
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    })
  }

  const sendData = () => {
    console.log(customInput)
    setCompileOutputDetails("");
    setProcessing(true);
    const options = {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      url: 'https://api.bricks.academy/api:problem/execute',
      data: {
        "language_id": language.id,
        // encode source code in base64
        "code": b64EncodeUnicode(code),
        "stdin": b64EncodeUnicode(customInput),
      }
    };
    axios
    .request(options)
    .then(function (response) {
      setProcessing(false);
      setCompileOutputDetails(response.data.response.result);
      showSuccessToast(`Compiled Successfully!`);
    })
    .catch((err) => {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    })
  };

  const handleSubmitExpand = () =>{
    if (submitExpanded == true){
      setSubmitExpanded(false)
    }else{
      setSubmitExpanded(true)
    }
    console.log(submitExpanded)
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex pt-1 flex-col">
        <div className = "block w-[100%] px-3 py-1">
          <div className = "flex justify-between" style={{height:"6vh"}}>
            <div className="mr-2 mb-2">
              <LanguagesDropdown onSelectChange={onSelectChange} />
            </div>
            <div className="flex">
              <div className="mr-2 mb-2">
                <FontSizeDropdown onSelectChange={onFontSizeSelectChange} />
              </div>
              <div className="mb-2">
                <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
              </div>
            </div>

          </div>
        
          <div className="items-end codeWindow " style={{height:"54vh"}}>
                <CodeEditorWindow
                  fontSize = {fontSize}
                  defaultValue = {PythonDefault}
                  code={code}
                  onChange={onChange}
                  language={language?.value}
                  theme={theme.value}
                />
          </div>

          <div className='flex' style={{height:"34vh"}}>

                <div className="relative w-[30%] mr-3">
                  <CustomInput
                    code = {code}
                    processing={processing}
                    sendData={sendData}
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                  />
                </div>

                <OutputWindow compileOutputDetails={compileOutputDetails} />

            </div>
        </div>
        
        <div className = "w-[100%] px-4 py-1 md:w-[40%] md:fixed md:top-20 md:right-10">
        {/* <CAccordion activeItemKey={1} onClick={}> */}
  
        {(user_id > 0) && (qid > 0) && <CAccordion className={submitExpanded? "w-[100%]": "ml-auto w-32 transition-all duration-700"}>
          <CAccordionItem itemKey={1}>
            <Submit 
            handleExpand={handleSubmitExpand}
            testcase={testcase} 
            code = {code}
            handleSubmit = {handleSubmit}
            submitOutputDetails = {submitOutputDetails}
            submitting = {submitting}/>
            </CAccordionItem>
        </CAccordion>}
        </div>
      </div>
  </>
  );
};
export default Landing;
