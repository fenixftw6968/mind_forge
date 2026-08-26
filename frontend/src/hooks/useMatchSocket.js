import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useMatchSocket(matchId, onEvent) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!matchId) return;

    let client = null;
    try {
      const wsUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/ws` : 'http://localhost:8080/ws';

      client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: () => {}, // Disable noisy debug logs
        onConnect: () => {
          setConnected(true);
          try {
            client.subscribe(`/topic/match/${matchId}`, (message) => {
              if (message.body) {
                try {
                  const payload = JSON.parse(message.body);
                  if (onEventRef.current) {
                    onEventRef.current(payload);
                  }
                } catch (e) {
                  console.warn('Failed to parse STOMP message', e);
                }
              }
            });
          } catch (subErr) {
            console.warn('Subscription error:', subErr);
          }
        },
        onStompError: (frame) => {
          console.warn('STOMP broker notice: ' + (frame?.headers?.message || ''));
        },
        onWebSocketClose: () => {
          setConnected(false);
        }
      });

      client.activate();
      clientRef.current = client;
    } catch (e) {
      console.warn('Could not initialize WebSocket client:', e);
    }

    return () => {
      try {
        if (client) {
          client.deactivate();
        }
      } catch (e) {}
      clientRef.current = null;
    };
  }, [matchId]);

  return { connected, client: clientRef.current };
}
