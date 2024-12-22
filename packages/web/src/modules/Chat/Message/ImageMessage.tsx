import React, { useState, useCallback, useRef, MouseEvent } from 'react';
import loadable from '@loadable/component';
import { isMobile } from '@fiora/utils/ua';
import { getOSSFileUrl } from '../../../utils/uploadFile';
import { CircleProgress } from '../../../components/Progress';
import { css } from 'linaria';

const styles = {
    imageMessage: css`
        position: relative;
        transform: skew(-5deg);
        border: 2px solid #ff0000;
        box-shadow: 3px 3px 0 #000000;
        background-color: #2b2b2b;
        padding: 4px;
        transition: all 0.3s cubic-bezier(0.7, 0, 0.3, 1);
        cursor: pointer;

        &:hover {
            transform: skew(-5deg) translateY(-4px);
            box-shadow: 5px 5px 0 #000000;
        }
    `,
    image: css`
        max-width: 100%;
        max-height: 200px;
        border: 1px solid #ff0000;
    `,
    loading: css`
        &::before {
            content: 'LOADING...';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0000;
            font-weight: bold;
            text-shadow: 1px 1px 0 #000000;
            letter-spacing: 2px;
        }
    `,
    progress: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    `,
    progressNumber: css`
        color: #ff0000;
        font-weight: bold;
        text-shadow: 1px 1px 0 #000000;
        letter-spacing: 2px;
    `
};

const ReactViewerAsync = loadable(() => import('react-viewer'));

function ImageMessage({ src, loading, percent }: { src: string; loading: boolean; percent: number }) {
    const [viewer, toggleViewer] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const closeViewer = useCallback(() => toggleViewer(false), []);
    const $container = useRef(null);

    // Keep existing image sizing logic
    let imageSrc = src;
    const containerWidth = isMobile ? window.innerWidth - 25 - 50 : 450;
    const maxWidth = containerWidth - 100 > 500 ? 500 : containerWidth - 100;
    const maxHeight = 200;
    let width = 200;
    let height = 200;

    const parseResult = /width=([0-9]+)&height=([0-9]+)/.exec(imageSrc);
    if (parseResult) {
        const natureWidth = +parseResult[1];
        const naturehHeight = +parseResult[2];
        let scale = 1;
        if (natureWidth * scale > maxWidth) {
            scale = maxWidth / natureWidth;
        }
        if (naturehHeight * scale > maxHeight) {
            scale = maxHeight / naturehHeight;
        }
        width = natureWidth * scale;
        height = naturehHeight * scale;
        imageSrc = /^(blob|data):/.test(imageSrc)
            ? imageSrc.split('?')[0]
            : getOSSFileUrl(src, `image/resize,w_${Math.floor(width)},h_${Math.floor(height)}/quality,q_90`);
    }

    function handleImageViewerMaskClick(e: MouseEvent) {
        if (e.target?.tagName !== 'IMG') {
            closeViewer();
        }
    }

    return (
        <>
            <div 
                className={`${styles.imageMessage} ${loading ? styles.loading : ''}`}
                ref={$container}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    className={styles.image}
                    src={imageSrc}
                    width={width}
                    height={height}
                    onClick={() => toggleViewer(true)}
                    alt="message"
                />
                {loading && (
                    <>
                        <CircleProgress
                            className={styles.progress}
                            percent={percent}
                            strokeWidth={5}
                            strokeColor="#ff0000"
                            trailWidth={5}
                        />
                        <div className={`${styles.progress} ${styles.progressNumber}`}>
                            {Math.ceil(percent)}%
                        </div>
                    </>
                )}
            </div>
            {viewer && (
                <ReactViewerAsync
                    visible={viewer}
                    onClose={closeViewer}
                    onMaskClick={handleImageViewerMaskClick}
                    images={[{ src: getOSSFileUrl(src, `image/quality,q_95`), alt: '' }]}
                    noNavbar
                />
            )}
        </>
    );
}

export default React.memo(ImageMessage);
