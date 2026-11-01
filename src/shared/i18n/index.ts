import i18n from 'i18next';
import {initReactI18next} from 'react-i18next'

import {authLocales} from '@/features/auth';
import {chatLocales} from '@/features/chat';
import viCommon from '@/shared/i18n/vi.json';
import enCommon from '@/shared/i18n/en.json';

const resource = {
    vi: {common: viCommon, auth: authLocales.vi, chat: chatLocales.vi},
    en: {common: enCommon, auth: authLocales.en, chat: chatLocales.en},
}

i18n.use(initReactI18next).init({
    resources: resource,
    lng: 'vi',
    debug: true,
});
