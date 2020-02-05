import React, { HTMLProps, HTMLButtonElement } from 'react'

type ButtonProps = HTMLProps<HTMLButtonElement>

function Button(props: ButtonProps) {
    return (
        <button
            style={{
                transition: 'all 0.15s ease-in-out',
            }}
            className="outline-none focus:shadow-outline leading-loose px-3 border hover:shadow-lg rounded hover:bg-blue-300 bg-blue-200 border-blue-500"
            {...props}
        />
    )
}

Button.defaultProps = {
    type: 'button',
    onClick() {},
}

export default Button
