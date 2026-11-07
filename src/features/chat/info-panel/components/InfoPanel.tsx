import './InfoPanel.scss'
import Button from "../../../../shared/components/Button";
import {useTranslation} from "react-i18next";


export default function InfoPanel() {
    const {t} = useTranslation("infoPanel");

    return (
        <aside className="info-panel">
            <div className={"title-container"}>
                <h3>{t("info-panel.title.conversation-info")}</h3>
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
                <div className={"title"}>{t("info-panel.title.image-video")}</div>
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
                    {t("info-panel.button.watch-all")}
                </Button>
            </div>

            <hr/>

            <div className={"resource__image"}>
                <div className={"title"}>
                    {t("info-panel.title.file")}
                </div>

            </div>

        </aside>
    )
}