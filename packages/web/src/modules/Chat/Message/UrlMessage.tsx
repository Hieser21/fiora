import React from 'react';
import { css } from 'linaria';

const persona5Style = css`
    display: inline-block;
    background-color: #2b2b2b;
    color:rgb(255, 255, 255);
    padding: 8px 16px;
    border: 2px solid #ff0000;
    border-radius: 4px;
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 3px 3px 0px #ff0000;
    
    &:hover {
        background-color: #ff0000;
        color: #ffffff;
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0px #ff0000;
    }
`;

interface UrlMessageProps {
    url: string;
}

function UrlMessage(props: UrlMessageProps) {
    const { url } = props;
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={persona5Style}
        >
            {url}
        </a>
    );
}

export default UrlMessage;
