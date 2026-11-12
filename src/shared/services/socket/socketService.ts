export interface SocketResponse<T = unknown> {
    status?: "success" | "error";
    event?: string;
    data?: T;
    mes?: string
}

type ResponseListener = (response: SocketResponse) => void;

class SocketService {
    private socket: WebSocket | null;
    private readonly SOCKET_URL = "wss://chat.longapp.io.vn/chat/chat";
    private listeners = new Map<string, Set<ResponseListener>>();

    constructor() {
        this.socket = null;
    }

    connect(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return Promise.resolve();
        }

        if (this.socket?.readyState === WebSocket.CONNECTING) {
            return Promise.reject(
                new Error("WebSocket is connecting !")
            )
        }

        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.socket = new WebSocket(this.SOCKET_URL);

            // @ts-ignore
            this.socket.onopen = () => {
                console.log("WebSocket Connected !");
                resolve();
            }

            // @ts-ignore
            this.socket.onclose = () => {
                console.log("WebSocket Disconnected !")
                this.socket = null;
            }

            // @ts-ignore
            this.socket.onerror = (error) => {
                console.error('WebSocket error: ', error);
                reject(error);
            }

            // @ts-ignore
            this.socket.onmessage = (event) => {
                const response = JSON.parse(event.data);

                if (!response.event) return;

                const eventListeners = this.listeners.get(response.event);

                eventListeners?.forEach(listener => listener(response));
                console.log(
                    `SERVER RESPONSE [${response.event}]:`,
                    response
                );

            }
        })
    }

    send(event: string, data: object) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected!");
            return;
        }

        if (!event && !data) {
            console.log("Please fill form !")
            return;
        }

        // ĐỊNH DẠNG THEO API MÀ THẦY GỬI
        const msg = {
            action: "onchat",
            data: {
                event,
                data: data
            }
        };

        console.log("SEND TO SERVER:", msg);

        // chuyển JavaScript Object thành JSON String và gửi đi dữ liệu
        this.socket.send(JSON.stringify(msg));

        console.log("Send request:", msg);
    }

    request<T = unknown>(event: string, data: object): Promise<SocketResponse<T>> {
        return new Promise((resolve, reject) => {
            const eventListeners =
                this.listeners.get(event) ?? new Set<ResponseListener>();

            const listener: ResponseListener = (response) => {
                eventListeners.delete(listener);
                if (eventListeners.size === 0) {
                    this.listeners.delete(event);
                }

                if (response.status === "error") {
                    reject(new Error(response.mes || `${event} failed`));
                    return;
                }

                resolve(response as SocketResponse<T>);
            }

            eventListeners.add(listener);

            this.listeners.set(event, eventListeners);

            try {
                this.send(event, data);
            } catch (error) {
                eventListeners.delete(listener);

                if (eventListeners.size === 0) {
                    this.listeners.delete(event);
                }

                reject(error);
            }
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

}

const chatSocket = new SocketService();
export default chatSocket;
