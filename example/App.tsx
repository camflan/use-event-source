import * as React from 'react';

import useEventSource, { Message } from '../.';

import Button from './Button';
import RevisionEntry from './RevisionEntry';

const WIKI_STREAMING_URL =
  'https://stream.wikimedia.org/v2/stream/recentchange';

export default function App() {
  const [events, setEvents] = React.useState(new Array(100));
  const {
    connectionStatus,
    error,
    openStream,
    closeStream,
  } = useEventSource(WIKI_STREAMING_URL, addEvent, { autoConnect: false });

  function addEvent(msg: Message) {
    setEvents(previousEvents => {
      try {
        // save messages newest -> oldest
        return [JSON.parse(msg.data), ...previousEvents.slice(0, 99)];
      } catch (err) {
        console.log(err.toString());
        return previousEvents;
      }
    });
  }

  // we're getting some malformed events....brute force remove them here
  // in production, we'd handle this differently
  const filteredEvents = events.filter(Boolean);

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row md:justify-between mb-2 pb-2 border-b -my-2">
        <div className="my-2">
          <h1 className="text-xl leading-tight">useEventSource Example</h1>
          <h2 className="font-light">Showing Wikipedia recent changes</h2>
        </div>

        <div className="my-2">
          <div className="inline-flex rounded border bg-gray-100 py-2 px-3">
            {connectionStatus === 'connected' ? (
              <div>
                Connected!
                <span className="ml-4">
                  <Button onClick={closeStream}>Disconnect</Button>
                </span>
              </div>
            ) : connectionStatus === 'connecting' ? (
              <div>Connecting</div>
            ) : (
              <div>
                Disconnected
                <span className="ml-4">
                  <Button onClick={openStream}>Connect</Button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500 border border-red-600 rounded shadow-xl py-2 px-2">
          <span className="font-bold">ERROR:</span> {error.toString()}
        </div>
      ) : null}

      {filteredEvents && filteredEvents.length > 0 ? (
        filteredEvents.map((data, idx) => (
          <>
            {idx > 0 && (
              <div className="my-2" key={data.timestamp + '-spacer'} />
            )}
            <RevisionEntry
              key={data.timestamp}
              timestamp={data.timestamp}
              type={data.type}
              domain={data.meta.domain}
              user={data.user}
            />
          </>
        ))
      ) : (
        <div className="">No Messages</div>
      )}
    </div>
  );
}
