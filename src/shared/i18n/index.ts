import i18n from 'i18next';
import {initReactI18next} from 'react-i18next'

import {authLocales} from '@/features/auth';
import viCommon from '@/shared/i18n/vi.json';
import enCommon from '@/shared/i18n/en.json';
import {conversationLocales} from "@/features/chat/conversation/locales";
import {messageLocales} from "@/features/chat/message/locales";
import {infoPanelLocales} from "@/features/chat/info-panel/locales";
import {layoutLocales} from "@/app/layouts/locales";

const resource = {
    vi: {
        common: viCommon,
        auth: authLocales.vi,
        conversation: conversationLocales.vi,
        message: messageLocales.vi,
        infoPanel: infoPanelLocales.vi,
        layout: layoutLocales.vi
    },
    en: {
        common: enCommon,
        auth: authLocales.en,
        conversation: conversationLocales.en,
        message: messageLocales.en,
        infoPanel: infoPanelLocales.en,
        layout: layoutLocales.en
    },
}

i18n.use(initReactI18next).init({
    resources: resource,
    lng: 'vi',
    debug: true,
});
