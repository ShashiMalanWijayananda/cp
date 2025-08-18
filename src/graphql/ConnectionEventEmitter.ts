type ConnectionEvent = 'connecting' | 'connected' | 'disconnected' | 'error' | 'completed';

type ConnectionEventCallback = (data?: any) => void;

type ConnectionEventListeners = {
    [K in ConnectionEvent]?: ConnectionEventCallback[];
};

class ConnectionEventEmitter {
    private listeners: ConnectionEventListeners = {};

    on(event: ConnectionEvent, callback: ConnectionEventCallback): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(callback);
    }

    off(event: ConnectionEvent, callback: ConnectionEventCallback): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback);
        }
    }

    emit(event: ConnectionEvent, data?: any): void {
        if (this.listeners[event]) {
            this.listeners[event]!.forEach(callback => callback(data));
        }
    }
}

export const connectionEvents = new ConnectionEventEmitter();
