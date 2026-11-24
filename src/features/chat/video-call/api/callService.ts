import {
    ref,
    set,
    onValue,
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
//  => nhưng nó cũng sẽ trả về 1 hàm để hủy lằng nghe
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

                const isReceiver = call.receiver === currentUsername;

                const isRinging = call.status === "ringing";

                // Chỉ nhận cuộc gọi trong vòng 60 giây
                const isRecent = now - call.createdAt < 60 * 1000;

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

export const cancelCall = async (callId: string | null) => {
    await update(
        ref(database, `calls/${callId}`), {
            status: "cancelled",
            cancelAt: Date.now()
        }
    )
}

export const listenCallStatus = (
    callId: string,
    callback: (status: string | null) => void
) => {
    const callRef = ref(database, `calls/${callId}`);

    const unsubscribe = onValue(callRef, (snapshot) => {
        const callData = snapshot.val();

        // console.log("DỮ LIỆU CALL TỪ FIREBASE:", callData);

        callback(callData?.status ?? null);
    });

    return unsubscribe;
};

// xử lyys lưu vaf lắng nghe offer cho webrtc
export const createOfferForCallId = async (callId: string, offer: RTCSessionDescriptionInit) => {
    await update(
        ref(database, `calls/${callId}/offer`), {
            type: offer.type,
            sdp: offer.sdp,
        }
    )
}

export const listenOfferByCallId = (callId: string, callback: (offer: RTCSessionDescriptionInit) => void) => {
    const offerRef = ref(database, `calls/${callId}/offer`);
    const unsubscribe = onValue(offerRef, (snapshot) => {
        const offer = snapshot.val();

        if (offer) {
            console.log("Nhận được Offer:", offer);

            callback(offer);
        }
    })

    return unsubscribe;
}

export const createAnswerForCallId = async (callId: string, answer: RTCSessionDescriptionInit) => {
    await update(
        ref(database, `calls/${callId}/answer`), {
            type: answer.type,
            sdp: answer.sdp
        }
    )
}

export const listenAnswerByCallId = (callId: string, callback: (answer: RTCSessionDescriptionInit) => void) => {
    const answerRef = ref(database, `calls/${callId}/answer`);
    const unsubscribe = onValue(answerRef, (snapshot) => {
        const answer = snapshot.val();

        if (answer) {
            console.log("Nhận được answer: ", answer);
            callback(answer)
        }
    })

    return unsubscribe;
}