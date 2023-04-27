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
  const [question, setQuestion] = useState(null);
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
    console.log(response.data);
    setQuestion(response.data['question']);
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
      console.log(response.data);
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
      console.log(response.data);
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
    const formData = {
      language_id: language.id,
      // encode source code in base64
      expected_output: btoa(testcase[0].output),
      source_code: btoa(code),
      stdin: btoa(testcase[0].input),
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
        console.log("res.data", response.data);
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
        setSubmitting(false);
        console.log("catch block...", error);
      });
  };

  const handleCompile = () => {
    setProcessing(true);
    {testcase.map(t => {

    })}

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
        console.log("res.data", response.data);
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

      {/* <a
        href="https://github.com/manuarora700/react-code-editor"
        title="Fork me on GitHub"
        class="github-corner"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 250 250"
          className="relative z-20 h-20 w-20"
        >
          <title>Fork me on GitHub</title>
          <path d="M0 0h250v250"></path>
          <path
            d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
            fill="currentColor"
            style={{ transformOrigin: "130px 110px" }}
            class="octo-arm"
          ></path>
          <path
            d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
            fill="currentColor"
            class="octo-body"
          ></path>
        </svg>
      </a> */}

      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      {/* <div className="flex flex-row"> */}
        {/* <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div> */}
        {/* <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div> */}
      {/* </div> */}
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="w-full h-full">
          <div className = "overflow-y-auto border-2 h-48 min-h-full mb-6">
            <pre className = "p-1">
              
              {question}
              <br></br>
              <br></br>
              <div>
                {example.map(e => {
                    return (
                      <div >
                        <h2>input = {e.input}</h2>
                        <h2>output: {e.output}</h2>
                        <h2>explanation: {e.explanation}</h2>
                        <hr />
                      </div>
                    );
                })}
              </div>

              {/* <br></br>
              <br></br>
              <b>Example1:</b>
              <br></br>
              Input: 121
              <br></br>
              Output: True
              <br></br>
              Explanation: 121 reads as 121 from left to right and from right to left.
              <br></br>
              <strong>Example2:</strong>
              <br></br>
              input: 10
              <br></br>
              output: false
              <br></br>
              explanation: Reads 01 from right to left. Therefore it is not a palindrome. */}
            </pre>
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
      {/* <Footer /> */}
    </>
  );
};
export default Landing;
