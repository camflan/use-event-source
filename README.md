# use-event-source
React hook for subscribing to an SSE endpoint


## usage
You bring the URL and onMessage callback. This allows you to use your own state mechanism: rxjs, redux, useState, etc

Basic usage, which will connect to the SSE endpoint as soon as the component renders,
```js
import React from 'react'

import useEventSource from 'use-event-source'

const styles = {
    messageWrapper: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    message: {
        border: "1px solid lightgrey",
        borderRadius: 2,
        padding: 5
    },
    spacer: {
        height: 10
    },
    error: {
        padding: 10,
        backgroundColor: red,
        color: white,
        border: "1px solid darkred"
    }
}

function App({streamURL, children}) {
    const [messages, setMessages] = React.useState([])

    const { error } = useEventSource(streamURL, addMessageToState)

    function addMessageToState(msg) {
        setMessages(previousMessages => {
            try {
                // save messages the last 100 messages, newest -> oldest
                return [JSON.parse(msg.data), ...previousMessages.slice(0, 99)]
            } catch (err) {
                // if malformed, just return the existing messages
                console.error(err.toString())
                return previousMessages
            }
        });
    }
    
    if(error) {
        <div style={styles.error}>
          {error.toString()}
        </div>
    }

    return (
        <div style={styles.messageWrapper}>
            {messages.map((msg, idx) => (
                <>
                    {idx > 0 && <div key={msg.timestamp + '-spacer'} style={styles.spacer} />}
                    <div key={msg.timestamp} style={styles.message}>
                        {msg.text}
                    </div>
                </>
            ))}
        </div>
    )
}
```


## api

### useEventSource
**params**
- url (string): the URL of the SSE endpoint you want to observe
- onMessage (function, (msg) => void): callback that will be called with the message from the stream
- configuration (object): configuration object
  - autoConnect (boolean): if false, useEventSource will not connect to the stream on render
  
**returns**
- object
  - error (Error): set to the EventSource error, if present
  - connectionStatus ("connected" | "connecting" | "disconnected"): the current EventSource status
  - openStream (() => void): fn to open the connection to the SSE endpoint. Use to restart the stream if stopped, or manually connect (eg, if autoConnect is false)
  - closeStream (() => void): fn to close the stream. Useful to stop listening when window is backgrounded, or to provide control to the user to open/close to the firehose
  
