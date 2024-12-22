import React from 'react';
import Prism from 'prismjs';
import { css } from 'linaria';

import xss from '@fiora/utils/xss';
import Style from './CodeMessage.less';
import Dialog from '../../../components/Dialog';

const persona5Code = css`
    .codeDialog {
        transform: skew(-3deg);
        border: 2px solid #ff0000;
        box-shadow: 5px 5px 0 #000000;
        background-color: #2b2b2b;
    }

    .pre {
        background: linear-gradient(135deg, #2b2b2b 0%, #1a1a1a 100%);
        border-left: 4px solid #ff0000;
        margin: 0;
        padding: 16px;
        
        &::-webkit-scrollbar {
            width: 8px;
            background: #1a1a1a;
        }
        
        &::-webkit-scrollbar-thumb {
            background: #ff0000;
        }
    }

    .code {
        color: #ffffff;
        text-shadow: 1px 1px 0 #000000;
        font-family: 'Fira Code', monospace;
        letter-spacing: 1px;
    }
`;

interface CodeDialogProps {
    visible: boolean;
    onClose: () => void;
    language: string;
    code: string;
}

function CodeDialog(props: CodeDialogProps) {
    const { visible, onClose, language, code } = props;
    const html = language === 'text' 
        ? xss(code)
        : Prism.highlight(code, Prism.languages[language], language);

    setTimeout(Prism.highlightAll.bind(Prism), 0);

    return (
        <Dialog
            className={`${Style.codeDialog} ${persona5Code}`}
            title="View Code"
            visible={visible}
            onClose={onClose}
        >
            <pre className={`${Style.pre} line-numbers`}>
                <code
                    className={`language-${language} ${Style.code}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </pre>
        </Dialog>
    );
}

export default CodeDialog;
