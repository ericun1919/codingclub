import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
// import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
// import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
// import ThemeDropdown from "./ThemeDropdown";
// import LanguagesDropdown from "./LanguagesDropdown";


const RAPID_API_URL = "https://judge0-ce.p.rapidapi.com/submissions"
const RAPID_API_HOST = "judge0-ce.p.rapidapi.com"
const RAPID_API_KEY = "fbe7df1e99msh10f296f62348e88p18ba83jsn4f2f578fb950"
const qid = '1002';
// const question = `Given an integer x, return true if x is a  palindrome ,and false otherwise.`;
const pythonDefault = `print('Hello World')`;

const Landing = () => {
  const [question, setQuestion] = useState({});
  const [testcase, setTestcase] = useState([]);
  const [example, setExample] = useState([]);
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [submitting, setSubmitting] = useState(null);


  

  
   
  
  // const [theme, setTheme] = useState("cobalt");
  const theme = {label: 'Oceanic Next', value: 'oceanic-next', key: 'oceanic-next'};
  // const [language, setLanguage] = useState(languageOptions[0]);
  const language = {id: 71, name: 'Python (3.8.1)', label: 'Python (3.8.1)', value: 'python'};
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // const onSelectChange = (sl) => {
  //   console.log("selected Option...", sl);
  //   // setLanguage(sl);
  //   console.log(language)
  // };
  useEffect(() => {
  let options = {
    method: "GET",
    url: 'https://api.bricks.academy/api:_codingclub_ide/codingclub_ide_question/' + qid,
  };
  axios
  .request(options)
  .then(function (response) {
    setQuestion(response.data);
  })
  .catch((err) => {
    let error = err.response ? err.response.data : err;
    // get error status
    console.log("catch block...", error);
  })
  getQuestion();
  getTestcase();
  },[]);

  function getTestcase(){
    const options = {
      method: "GET",
      url: 'https://api.bricks.academy/api:_codingclub_ide/codingclub_ide_testcase/' + qid + '/true',
    };
    axios
    .request(options)
    .then(function (response) {
      setTestcase(response.data);
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    });
  }
  function getQuestion(){
    const options = {
      method: "GET",
      url: 'https://api.bricks.academy/api:_codingclub_ide/codingclub_ide_testcase/' + qid,
    };
    axios
    .request(options)
    .then(function (response) {
      setExample(response.data);
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      console.log("catch block...", error);
    });
  }



  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        // console.log(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleSubmit = () => {
    
    setSubmitting(true);
    
    let form = []
    
    {testcase.map(t => {
      const newItem = {
        language_id: language.id,
        // encode source code in base64
        expected_output: btoa(t.output),
        source_code: btoa(code),
        stdin: btoa(t.input),
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
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setSubmitting(false);
        console.log("catch block...", error);
      });
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
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
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
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
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setSubmitting(false);
        setOutputDetails(response.data);
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
        }, 4000);
        return;
      } else {

        setProcessing(false);
        setSubmitting(false);
        {response.data.submissions.map(d => {
          console.log(d);
          setOutputDetails(d);
        })}
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
  // function handleThemeChange(th) {
  //   const theme = th;
  //   console.log("theme...", theme);

  //   if (["light", "vs-dark"].includes(theme.value)) {
  //     setTheme(theme);
  //   } else {
  //     defineTheme(theme.value).then((_) => setTheme(theme));
  //   }
  // }
  useEffect(() => {
    defineTheme("oceanic-next");
    // defineTheme("oceanic-next").then((_) =>
    //   setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    ;
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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

      <div className="h-4 w-full bg-gradient-to-r from-violet-900 via-indigo-950 to-violet-600"></div>
      <nav class="bg-white border-gray-200">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between  p-4">
          <a class="flex items-center">
              <img src={process.env.PUBLIC_URL + '/LogoHome.png'}  class="h-16 mr-3" alt="HomeLogo" />
          </a>

          {/* <div class="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>

      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="w-full h-full">
          <div className = "overflow-y-auto h-90 min-h-full mb-6">
            <div className = "p-3 bg-stone-50 rounded-tl-lg">
              <h1 className='text-xl font-mono '>ID: {question.question_id}</h1>
              <h1 className='text-xl font-mono '>{question.question}</h1>
              <br></br>
              <br></br>
              <h1 className='text-xl font-mono'>
                Examples
              </h1>
              <br></br>
              <div>
                {example.map(e => {
                    return (
                      <div className='p-5 bg-stone-100 border-4 rounded-lg m-3'>
                        <h4>Input = {e.input}</h4>
                        <h4>Output: {e.output}</h4>
                        <h4>Explanation: {e.explanation}</h4>
                      </div>
                    );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={theme.value}
            />
          </div>
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!code} 
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              
              {submitting ? "Processing..." : "Submit"}
            </button>
          </div>

          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          
        </div>
      </div>
    </>
  );
};
export default Landing;
