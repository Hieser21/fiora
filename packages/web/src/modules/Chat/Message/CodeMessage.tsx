import React, { useState } from 'react';
import loadable from '@loadable/component';

import Style from './CodeMessage.less';

const CodeDialogAsync = loadable(() =>
    // @ts-ignore
    import(/* webpackChunkName: "code-dialog" */ './CodeDialog'),
);
type LanguageMap = {
    [language: string]: string;
};

const languagesMap: LanguageMap = {
    javascript: 'javascript',
    typescript: 'typescript',
    java: 'java',
    c_cpp: 'cpp',
    python: 'python',
    ruby: 'ruby',
    php: 'php',
    golang: 'go',
    csharp: 'csharp',
    html: 'html',
    css: 'css',
    sql: 'sql',
    json: 'json',
    text: 'text',
};
// ... keep existing languagesMap ...
interface CodeMessageProps {
    code: string;
}

function CodeMessage(props: CodeMessageProps) {
    const { code } = props;
    const [codeDialog, toggleCodeDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const parseResult = /@language=([_a-z]+)@/.exec(code);
    if (!parseResult) {
        return <pre className="code">Unsupported programming language</pre>;
    }

    const language = languagesMap[parseResult[1]] || 'text';
    const rawCode = code.replace(/@language=[_a-z]+@/, '');
    let size = `${rawCode.length}B`;
    if (rawCode.length > 1024) {
        size = `${Math.ceil((rawCode.length / 1024) * 100) / 100}KB`;
    }

    return (
        <>
            <div
                className={Style.codeMessage}
                onClick={() => toggleCodeDialog(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                style={{
                    transform: isHovered ? 'skew(-5deg) translateY(-4px)' : 'skew(-5deg)',
                    transition: 'all 0.2s cubic-bezier(0.7, 0, 0.3, 1)'
                }}
            >
                <div className={Style.codeInfo}>
                    <div className={Style.icon}>
                        <i className="iconfont icon-code" style={{
                            fontSize: '20px',
                            textShadow: '2px 2px 0 #000000'
                        }} />
                    </div>
                    <div>
                        <span style={{
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 'bold'
                        }}>{language}</span>
                        <span className={Style.codeSize}>{size}</span>
                    </div>
                </div>
                <p className={Style.codeViewButton} style={{
                    fontWeight: 'bold',
                    textShadow: '1px 1px 0 #000000'
                }}>
                    TAKE IT
                </p>
            </div>
            {codeDialog && (
                <CodeDialogAsync
                    visible={codeDialog}
                    onClose={() => toggleCodeDialog(false)}
                    language={language}
                    code={rawCode}
                />
            )}
        </>
    );
}

export default CodeMessage;
