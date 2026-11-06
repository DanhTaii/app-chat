class SocketService {
    private socket: WebSocket | null;
    private readonly SOCKET_URL = "wss://chat.longapp.io.vn/chat/chat";

    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        // @ts-ignore
        this.socket = new WebSocket(this.SOCKET_URL);

        // @ts-ignore
        this.socket.onopen = () => {
            console.log("WebSocket Connected !")
        }

        // @ts-ignore
        this.socket.onclose = () => {
            console.log("WebSocket Connected !")
        }

        // @ts-ignore
        this.socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        }

        // @ts-ignore
        this.socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('Server response: ', response)
        }
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

        // chuyển JavaScript Object thành JSON String và gửi đi dữ liệu
        this.socket.send(JSON.stringify(msg));

        console.log("Send request:", msg);
    }

    disconnect() {
        if (!this.socket) {
            // @ts-ignore
            this.socket.close();
            this.socket = null;
        }
    }

}

const chatSocket = new SocketService();
export default chatSocket;
