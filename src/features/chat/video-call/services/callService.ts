import {ref, set} from "firebase/database";
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