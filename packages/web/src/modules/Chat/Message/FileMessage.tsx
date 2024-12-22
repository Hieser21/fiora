import React, { useState } from 'react';
import { css } from 'linaria';
import filesize from 'filesize';
import { getOSSFileUrl } from '../../../utils/uploadFile';

const styles = {
    container: css`
        display: block;
        min-width: 160px;
        max-width: 240px;
        padding: 0 4px;
        text-align: center;
        cursor: pointer;
        color: #ffffff;
        text-decoration: none;
        transform: skew(-5deg);
        border: 2px solid #ff0000;
        box-shadow: 3px 3px 0 #000000;
        background-color: #2b2b2b;
        transition: all 0.3s cubic-bezier(0.7, 0, 0.3, 1);

        &:hover {
            transform: skew(-5deg) translateY(-4px);
            box-shadow: 5px 5px 0 #000000;
        }
    `,
    fileInfo: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom: 2px solid #ff0000;
        padding: 8px 0;
    `,
    fileInfoText: css`
        word-break: break-all;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 1px 1px 0 #000000;
        font-weight: bold;
    `,
    button: css`
        display: inline-block;
        font-size: 12px;
        text-align: center;
        margin-top: 6px;
        color: #ff0000;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: bold;
        text-shadow: 1px 1px 0 #000000;
        transition: color 0.3s ease;

        &:hover {
            color: #ffffff;
        }
    `,
};

function FileMessage({ file, percent }: { file: string; percent: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const { fileUrl, filename, size } = JSON.parse(file);
    const url = fileUrl && getOSSFileUrl(fileUrl);

    return (
        <a
            className={styles.container}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...(fileUrl
                ? { href: url, download: filename, target: '_blank' }
                : {})}
        >
            <div className={styles.fileInfo}>
                <i className="iconfont icon-file" style={{
                    fontSize: '24px',
                    color: '#ff0000',
                    textShadow: '2px 2px 0 #000000',
                    marginBottom: '4px'
                }} />
                <span className={styles.fileInfoText}>{filename}</span>
                <span className={styles.fileInfoText}>{filesize(size)}</span>
            </div>
            <p className={styles.button}>
                {percent === undefined || percent >= 100
                    ? 'DOWNLOAD'
                    : `LOADING... ${percent.toFixed(0)}%`}
            </p>
        </a>
    );
}

export default React.memo(FileMessage);
