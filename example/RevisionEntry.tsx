import * as React from 'react'
import cx from 'classnames'

import Badge from './Badge'

const EntryStyles = {
    categorize: 'border-blue-500 bg-blue-100',
    new: 'border-green-700 bg-green-100',
    edit: 'border-purple-600 bg-purple-100',
    log: 'border-orange-500 bg-yellow-100',
}

interface RevisionEntryProps {
    type: string
    timestamp: number
    domain: string
    user: string
}

function RevisionEntry({ type, timestamp, domain, user }) {
    return (
        <div
            className={cx(
                'flex flex-col border p-2 rounded',
                type in EntryStyles ? EntryStyles[type] : 'bg-black text-white'
            )}
        >
            <div className="flex flex-col md:flex-row md:justify-between">
                <div className="font-semibold text-sm">
                    {timestampToString(timestamp)}
                </div>
                <div className="text-sm">{domain}</div>
            </div>
            <div className="flex items-baseline">
                <Badge type={type} />
                Revision by {user}
            </div>
        </div>
    )
}

const padTimeComponent = component => component.toString().padStart(2, '0')

function timestampToString(timestamp) {
    // timestamp is POSIX -> make ms
    const date = new Date(timestamp * 1000)

    const minutes = padTimeComponent(date.getMinutes())
    const seconds = padTimeComponent(date.getSeconds())
    const meridian = date.getHours() < 12 ? 'am' : 'pm'
    let hour = date.getHours() % 12
    // if we get 0 (midnight) we need to change to '12'
    hour = hour ? padTimeComponent(hour) : '12'

    return `${hour ? hour : '12'}:${minutes}:${seconds} ${meridian}`
}

export default RevisionEntry
