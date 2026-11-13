// Dạng response mà server trả về (api của thầy)
export interface SocketResponse<T = unknown> {
    status?: "success" | "error";
    event?: string;
    data?: T;
    mes?: string
}

// Dạng hàm callback, phải nhận 1 repsonse dạng SocketResponse, Kiểu hàm xử lý response.
type SocketResponseHandler = (response: SocketResponse) => void;

class SocketService {
    private socket: WebSocket | null;
    private readonly SOCKET_URL = "wss://chat.longapp.io.vn/chat/chat";
    // nơi lưu hàm callback đang chờ nhận response.
    // Tức là với mỗi EVENT sẽ có 1 danh sách các hàm callback xử lý riêng biệt
    // Tức là Map<EVENT, [callback1, callback2, . . .]>
    // EVENT đây có thể là "SEND_CHAT", "LOGIN", . . . tùy vào dạng maf server hay dev muốn
    // cái dùng cho cho danjg request tức là gửi và nhajan ngay laajp tức
    private requestListeners = new Map<string, Set<SocketResponseHandler>>();

    // CÁI NÀY CHUYÊN CHO XỬ LÝ các response gửi đến người dùng
    private receiveListeners = new Map<string, Set<SocketResponseHandler>>();

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
            // ------ CHỖ XỬ LÝ NHẬN RESPONSE TỪ SERVER BACKEND
            this.socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                // console.log("CONNECTE SOCKET ONMSG - raw: ", event);
                // console.log("CONNECTE SOCKET ONMSG - none raw: ", response);

                console.log("-----------------XỬ LÝ REQUEST RESPONSE: ")
                if (!response.event) return;

                // Tìm danh sách listener theo event và server trả về
                const eventRequestListeners = this.requestListeners.get(response.event);

                // Duyệt qua danh sách listener hiện tại và dùng hàm callback là handle
                eventRequestListeners?.forEach((responseHandler) => {
                    // Xử lý callback
                    responseHandler(response)
                });

                console.log(
                    `SERVER RESPONSE [${response.event}]:`,
                    response
                );

                console.log("------------XỬ LÝ RECEIVE RESPONSE: ")
                // Tìm danh sách listener theo event và server trả về
                const eventReceiveListeners = this.receiveListeners.get(response.event);

                // Duyệt qua danh sách listener hiện tại và dùng hàm callback là handle
                eventReceiveListeners?.forEach((responseHandler) => {
                    // Xử lý callback
                    responseHandler(response)
                });

                // console.log("CURRENT LISTENER: ", this.listeners);

            }
        })
    }

    send(event: string, data: object) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            // console.error("WebSocket is not connected!");
            throw new Error("WebSocket is not connected!");
            // return;
        }

        if (!event && !data) {
            throw new Error("Invalid event or data!");
            // console.log("Please fill form !")
            // return;
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
        console.log("SEND TO SERVER:", msg);
    }

    request<T = unknown>(event: string, data: object): Promise<SocketResponse<T>> {
        // Phần Promise này đang đảm bảo cả quas trình twf lúc guửi request lên server đến lúc nhận được response từ server
        return new Promise((resolve, reject) => {

            //Bước 1:  Lấy ra danh sách listener của event
            const eventListeners = this.requestListeners.get(event) ?? new Set<SocketResponseHandler>();

            //Bước 2: Tạo 1 hàm callback xử lý response server. Ở KHÚC onmessage trên phần connect
            // Tạo một hàm callback có tên handleListener
            const responseHandler: SocketResponseHandler = (response) => {

                // ---------------- XỬ LÝ XÓA EVENT KHỎI DANH SÁCH LISTENER
                // Khi callback được gọi, xóa chính ResponseListener khỏi danh sách chờ của event trong listener
                eventListeners.delete(responseHandler);

                if (eventListeners.size === 0) {
                    // Nếu như cái event đó hiện không conf thì xóa luôn khỏi listeners
                    this.requestListeners.delete(event);
                }
                // => Ngán gọn là nó sẽ xóa SocketResponseListener khỏi danh sách Set của event đó
                // rồi kiểm tra xem phaanf danh sách Set của event đó còn SocketResponseListener nào không
                // Nếu không thì xóa luôn
                // ---------------- XỬ LÝ XÓA EVENT KHỎI DANH SÁCH LISTENER

                // Kiểm tra respone mà server trả về
                if (response.status === "error") {
                    // Báo promise thất bại
                    reject(new Error(response.mes || `${event} failed`));
                    return;
                }

                // Báo promise thành công và trả về cho nơi gọi request dạng SocketResponse
                resolve(response as SocketResponse<T>);
            }
            // +++++++++++++++++++++++++++++++++++ Bước 2: XỬ LÝ RESPONSE KHI SERVER PHẢN HỒI

            // Bước 3: Thêm listener đó vào
            eventListeners.add(responseHandler);

            this.requestListeners.set(event, eventListeners);

            // ------------ BƯỚC 4: XỬ LÝ GỬI DATA ĐẾN SERVER
            try {
                // Dùng lại hàm send data đã xử lý tuuwosc đó
                this.send(event, data);
            } catch (error) {
                eventListeners.delete(responseHandler);

                if (eventListeners.size === 0) {
                    this.requestListeners.delete(event);
                }

                reject(error);
                throw new Error(`ERROR SEND DATA: ${error}`)
            }
        })
    }

    subscribeReceiveMessage(event: string, callback: SocketResponseHandler) {
        console.log("XỬ LÝ NHẬN TIN NHẮN MỚI: ", event);
        // Lấy danh sách listener của receive listener
        // Kiểm tra xem có event chưa nếu chưa có thì tạo mới
        if (!this.receiveListeners.get(event)) {
            this.receiveListeners.set(event, new Set<SocketResponseHandler>());
        }

        // rồi thêm nó vào
        this.receiveListeners.get(event)?.add(callback)
    }

    // Hủy đăng ký lắng nghe
    unsubscribeReceiveMessage(event: string, callback: SocketResponseHandler) {
        let eventReceiveListeners = this.receiveListeners.get(event);

        if (!eventReceiveListeners) return;

        eventReceiveListeners.delete(callback)

        if (eventReceiveListeners.size === 0) {
            this.receiveListeners.delete(event)
        }

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
