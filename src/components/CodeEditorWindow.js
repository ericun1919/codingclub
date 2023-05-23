import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({fontSize, onChange, language, code, theme ,defaultValue}) => {

  const [value, setValue] = useState(code || "");
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full border-2 border-inherit">
      <Editor
        height="58vh"
        width={`100%`}
        language={language || "javascript"}
        value={value || defaultValue}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          folding: true,
          fontSize:`${fontSize}px`,
          minimap: {
            enabled: false,
          },
          glyphMargin: false,
          lineDecorationsWidth: 1,
          lineNumbersMinChars: 2

    }}
      />
    </div>
  );
};
export default CodeEditorWindow;
