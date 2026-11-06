import './InfoPanel.scss'
import Button from "../../../../shared/components/Button";


export default function InfoPanel() {
    return (
        <aside className="info-panel">
            <div className={"title-container"}>
                <h3>Thông tin hội thoại</h3>
            </div>

            <hr/>

            <div className={"user-info"}>
                <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                <div className={"username__container"}>
                    <div>
                        Minh Anh
                    </div>
                    <i className="fa-solid fa-pen"></i>
                </div>
            </div>

            <hr/>

            <div className={"resource__image"}>
                <div className={"title"}>Ảnh / Video</div>
                <div className={"resource__image-list-vertical"}>
                    <div className={"resource__image-list-horizontal"}>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                    </div>
                    <div className={"resource__image-list-horizontal"}>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                        <img src="/src/shared/assets/avatar.webp"/>
                    </div>
                </div>
                <Button type="button" className="btn">
                    Xem tất cả
                </Button>
            </div>

            <hr/>

            <div className={"resource__image"}>
                <div className={"title"}>Tài liệu đính kèm</div>

            </div>

        </aside>
    )
}