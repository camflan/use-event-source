import React from 'react'
import cx from 'classnames'

const BadgeStyles = {
    categorize: 'bg-blue-600 shadow text-white',
    new: 'bg-green-700 text-white',
    edit: 'bg-purple-600 text-white',
    log: 'bg-orange-500 text-white',
}

interface BadgeProps {
    type: 'log' | 'categorize' | 'edit' | 'new' | string
}

function Badge({ type }: BadgeProps) {
    return (
        <div
            className={cx(
                'mr-2 text-xs leading-tight font-bold rounded-full px-2',
                BadgeStyles[type]
            )}
        >
            {type.toUpperCase()}
        </div>
    )
}

export default Badge
