import React from "react"

export type EventSourceConnectionStatus =
    | "connected"
    | "disconnected"
    | "connecting"

export type Message = {
    origin: string
    lastEventId: string
    data: any
}

interface EventSourceOptions {
    withCredentials: boolean
}

interface UseEventSourceConfig {
    autoConnect: boolean
    eventSourceConfig: EventSourceOptions
}

const Defaults = { autoConnect: true }
function useEventSource(
    url: string,
    onMessage: (msg: Message) => void,
    config: UseEventSourceConfig
) {
    const options = { ...Defaults, ...config }

    const [connectionStatus, setConnectionStatus] = React.useState<
        EventSourceConnectionStatus
    >("disconnected")
    const [error, setError] = React.useState<ErrorEvent | null>(null)
    const streamRef = React.useRef<EventSource>()

    const openStream = React.useCallback(() => {
        const stream = new EventSource(url, options.eventSourceConfig)
        stream.onopen = () => setConnectionStatus("connected")
        stream.onerror = msg => void setError(msg as ErrorEvent)
        stream.onmessage = onMessage
        streamRef.current = stream
    }, [url, onMessage])

    function closeStream() {
        if (streamRef.current && streamRef.current.close) {
            streamRef.current.close()
            streamRef.current = undefined
            setConnectionStatus("disconnected")
            setError(null)
        }
    }

    React.useEffect(() => {
        if (options.autoConnect) {
            openStream()
            return closeStream
        }

        return
    }, [openStream, options.autoConnect])

    return React.useMemo(() => {
        return {
            connectionStatus,
            error,
            closeStream,
            openStream,
        }
    }, [openStream, connectionStatus, error])
}

export default useEventSource
