import React from 'react';

import './IconButton.css';

export function IconButton(props) {

    const { text, icon, size, color, onChangeMethod, image, imageStyle } = props;
    const sizeIcons = {
        sm: "3rem",
        md: "4rem",
        lg: "5rem",
        xl: "6rem"
    }

    if (image) return(
        <div className='container-icon-button' onClick={onChangeMethod ? onChangeMethod : null}>
             <div className='container-image-icon-button' style={imageStyle}>
                <img src={image} alt="Logo"/>
             </div>

            {text}
        </div>
    )

    return (
        <div className='container-icon-button' onClick={onChangeMethod ? onChangeMethod : null}>
            <div
                className='container-icon'
                style={{
                    color: color ? color : "black",
                    fontSize: size ? sizeIcons[size] : "3rem"
                }}
            >
                {icon}
            </div>
            {text}
        </div>
    )
}
