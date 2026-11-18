import {
    ref,
    set,
    onValue,
    push,
    update
} from "firebase/database";
import {database} from "@/shared/services/firebase/firebase.ts";

export const createCall = async (
    caller: string,
    receiver: string
) => {
    const callId = crypto.randomUUID();

    await set(ref(database, `calls/${callId}`), {
        caller,
        receiver,
        status: "ringing",
        createdAt: Date.now()
    });

    return callId;
};

// @ts-ignore
// ref(database, "calls"): trỏ đến danh sách cuộc gọi trên Firebase.
// onValue(...): lắng nghe dữ liệu. Khi dữ liệu thay đổi, callback được gọi.
// snapshot.val(): lấy dữ liệu từ Firebase.
// Object.entries(calls): duyệt từng cuộc gọi, lấy cả callId và dữ liệu cuộc gọi.
// unsubscribe: hàm dùng để ngừng lắng nghe khi không cần nữa.

export const listenIncomingCall = (
    currentUsername: string,
    callback: (call: any) => void
) => {
    const callsRef = ref(database, "calls");

    const unsubscribe = onValue(callsRef, (snapshot) => {
        const calls = snapshot.val();

        if (!calls) {
            callback(null);
            return;
        }

        const now = Date.now();

        const incomingCalls = Object.entries(calls)
            .filter(([callId, call]: [string, any]) => {

                const isReceiver =
                    call.receiver === currentUsername;

                const isRinging =
                    call.status === "ringing";

                // Chỉ nhận cuộc gọi trong vòng 60 giây
                const isRecent =
                    now - call.createdAt < 60 * 1000;

                return isReceiver && isRinging && isRecent;
            })
            .map(([callId, call]: [string, any]) => ({
                callId,
                ...call
            }));

        // Lấy cuộc gọi mới nhất
        const latestCall = incomingCalls.sort(
            (a, b) => b.createdAt - a.createdAt
        )[0];

        callback(latestCall || null);
    });

    return unsubscribe;
};


export const acceptCall = async (callId: string) => {
    await update(
        ref(database, `calls/${callId}`), {
            status: "accepted",
            acceptedAt: Date.now()
        }
    )
}

export const rejectCall = async (callId: string) => {
    await update(
        ref(database, `calls/${callId}`), {
            status: "rejected",
            rejectedAt: Date.now()
        }
    )
}