import "./WaitingCall.scss";

// @ts-ignore
export default function WaitingCall({receiver, onCancel}) {
    return (
        <div className="call-waiting-overlay">
            <div className="call-waiting-content">
                <div className="call-avatar">
                    <img src="/src/shared/assets/avatar.webp" alt="Avatar"/>
                </div>

                <h2>{receiver}</h2>

                <p>Đang gọi...</p>

                <div className="calling-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <button
                    className="cancel-call-btn"
                    onClick={onCancel}
                >
                    <i className="bi bi-telephone-x"></i>
                    Hủy
                </button>
            </div>
        </div>
    );
}