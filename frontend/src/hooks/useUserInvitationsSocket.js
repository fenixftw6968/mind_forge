import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useUserInvitationsSocket(userId, onEvent) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!userId) return;

    let client = null;
    try {
      const host = window.location.hostname || 'localhost';
      const defaultWs = `http://${host}:8080/ws`;
      const wsUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/ws` : defaultWs;

      client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: () => {},
        onConnect: () => {
          setConnected(true);
          try {
            client.subscribe(`/topic/invitations/${userId}`, (message) => {
              if (message.body) {
                try {
                  const payload = JSON.parse(message.body);
                  if (onEventRef.current) {
                    onEventRef.current(payload);
                  }
                } catch (e) {
                  console.warn('Failed to parse STOMP invitation message', e);
                }
              }
            });
          } catch (subErr) {
            console.warn('Invitation subscription error:', subErr);
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
      console.warn('Could not initialize User Invitations WebSocket client:', e);
    }

    return () => {
      try {
        if (client) {
          client.deactivate();
        }
      } catch (e) {}
      clientRef.current = null;
    };
  }, [userId]);

  return { connected };
}
