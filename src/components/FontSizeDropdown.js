import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import { fontSizeOptions } from "../constants/fontSizeOptions";
import { useTranslation, Trans } from 'react-i18next';

const FontSizeDropdown = ({ onSelectChange }) => {
    const { t, i18n } = useTranslation();
    function translationList(f){
        for (let i = 0; i < f.length; i++){
            let temp = t(f[i].name)
            f[i].label = <div className="flex items-center"><img className="h-5 mr-1" src={process.env.PUBLIC_URL  + `/fontsize_${f[i].name}.png`}/> {temp}</div>
        } 
        return f
    }
    function translation(f){


        let temp = t(f.name)
        f.label = <div className="flex items-center"><img className="h-5 mr-1" src={process.env.PUBLIC_URL  + `/fontsize_${f.name}.png`}/> {temp}</div>

        return f
    }
    return (
        <Select
        placeholder={`Filter By Category`}
        options={translationList(fontSizeOptions)}
        styles={customStyles}
        defaultValue={translation(fontSizeOptions[1])}
        onChange={(selectedOption) => onSelectChange(translation(selectedOption))}
        />
    );
};

export default FontSizeDropdown;
