import React, { useRef, useState } from 'react';
import { css } from 'linaria';
import IconButton from './IconButton';

const inputStyle = css`
    .inputContainer {
        position: relative;
        display: flex;
        align-items: center;
        transform: skew(-5deg);
        border: 2px solid #ff0000;
        box-shadow: 3px 3px 0 #000000;
        background-color: #2b2b2b;
        transition: all 0.3s ease;

        &:focus-within {
            transform: skew(-5deg) translateY(-2px);
            box-shadow: 5px 5px 0 #000000;
            border-color: #ffffff;
        }
    }

    .input {
        flex: 1;
        padding: 8px 12px;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 14px;
        letter-spacing: 1px;

        &::placeholder {
            color: rgba(255, 0, 0, 0.6);
        }

        &:focus {
            outline: none;
        }
    }

    .inputIconButton {
        margin-right: 4px;
    }
`;

interface InputProps {
    value?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
    onEnter?: (value: string) => void;
    onFocus?: () => void;
}

function Input(props: InputProps) {
    const {
        value,
        type = 'text',
        placeholder = '',
        className = '',
        onChange,
        onEnter = () => {},
        onFocus = () => {},
    } = props;

    const [lockEnter, setLockEnter] = useState(false);
    const $input = useRef(null);

    function handleInput(e: any) {
        onChange(e.target.value);
    }

    function handleIMEStart() {
        setLockEnter(true);
    }

    function handleIMEEnd() {
        setLockEnter(false);
    }

    function handleKeyDown(e: any) {
        if (lockEnter) {
            return;
        }
        if (e.key === 'Enter') {
            onEnter(value as string);
        }
    }

    function handleClickClear() {
        onChange('');
        // @ts-ignore
        $input.current.focus();
    }

    return (
        <div className={`${inputStyle} ${className}`}>
            <input
                className="input"
                type={type}
                value={value}
                onChange={handleInput}
                onInput={handleInput}
                placeholder={placeholder}
                ref={$input}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleIMEStart}
                onCompositionEnd={handleIMEEnd}
                onFocus={onFocus}
            />
            <IconButton
                className="inputIconButton"
                width={32}
                height={32}
                iconSize={18}
                icon="clear"
                onClick={handleClickClear}
            />
        </div>
    );
}

export default Input;
