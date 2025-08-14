import { Markup } from "telegraf";

// Сообщения бота
export const MESSAGE = {
    WELCOME: "Привет! Давай создадим твою анкету. Как тебя зовут?",
    NICE_TO_MEET: "Приятно познакомиться, {name}! Сколько тебе лет?",
    INVALID_AGE: "Пожалуйста, введи число от 18 до 100! Сколько тебе лет?",
    TELL_ABOUT_YOURSELF: "Расскажи немного о себе (максимум 500 символов):",
    SEND_PHOTO: "Теперь пришли своё фото:",
    CHOOSE_GENDER: "Выбери свой пол:",
    CHOOSE_INTEREST: "Кто тебе интересен?",
    PROFILE_INCOMPLETE: "Сначала заполни анкету через /start",
    PROFILE_RESET: "Анкета сброшена. Начни заново с /start",
    PROFILE_EDITED: "Анкета обновлена!",
    ERROR_OCCURRED: "Произошла ошибка. Попробуй еще раз.",
    USE_COMMANDS: "Используй команды для управления анкетой",
    PHOTO_REQUIRED: "Пожалуйста, пришли фото для анкеты",
    INVALID_BIO_LENGTH: "Описание слишком длинное. Максимум 500 символов.",
    INVALID_NAME_LENGTH: "Имя слишком длинное. Максимум 50 символов."
}

// Эмодзи
export const EMOJIS = {
    MALE: "👨",
    FEMALE: "👩",
    ANY: "🤷",
    BOY: "👨",
    GIRL: "👩",
    HEART: "❤️",
    CHECK: "✅",
    CROSS: "❌"
} as const;

// Тексты для отображения
export const DISPLAY_TEXTS = {
    MALE_BOY: `${EMOJIS.MALE} Парень`,
    FEMALE_GIRL: `${EMOJIS.FEMALE} Девушка`,
    MALE_INTEREST: `${EMOJIS.MALE} Парни`,
    FEMALE_INTEREST: `${EMOJIS.FEMALE} Девушки`,
    ANY_INTEREST: `${EMOJIS.ANY} Без разницы`
} as const 

// Ограничения
export const LIMITS = {
    MIN_AGE: 10,
    MAX_AGE: 100,
    MAX_NAME_LENGTH: 50,
    MAX_BIO_LENGTH: 500,
    MAX_PHOTO_SIZE: 10 * 1024 * 1024, //10MB
} as const 

// Callback действия
export const CALLBACK_ACTIONS = {
    GENDER: "gender",
    INTEREST: "interest",
    BACK: "back",
    CANCEL: "cancel",
    CONFIRM: "confirm"
} as const;

// Кнопки для выбора пола
export const genderButton = Markup.inlineKeyboard([
    [Markup.button.callback(DISPLAY_TEXTS.MALE_BOY, "male")],
    [Markup.button.callback(DISPLAY_TEXTS.FEMALE_GIRL, "female")],
]);

// Кнопки для выбора предпочтений
export const interestButton = Markup.inlineKeyboard([
    [Markup.button.callback(DISPLAY_TEXTS.MALE_INTEREST, "interest_male")],
    [Markup.button.callback(DISPLAY_TEXTS.FEMALE_INTEREST, "interest_female")],
    [Markup.button.callback(DISPLAY_TEXTS.ANY_INTEREST, "interest_any")],
]);

