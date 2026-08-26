import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useMatchSocket(matchId, onEvent) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    // Use same host as API base, replace http/https with ws/wss or use absolute url if empty.
    const wsUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/ws` : 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/match/${matchId}`, (message) => {
          if (message.body) {
            try {
              const payload = JSON.parse(message.body);
              if (onEvent) onEvent(payload);
            } catch (e) {
              console.error('Failed to parse STOMP message', e);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [matchId]);

  return { connected, client: clientRef.current };
}
