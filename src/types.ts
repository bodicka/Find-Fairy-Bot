import { Context } from "telegraf";

// Состояния пользователя
export enum UserState {
    NAME = "name",
    AGE = "age",
    BIO = "bio",
    PHOTO = "photo",
    GENDER = "gender",
    INTEREST = "interest",
    COMPLETE = "complete"
}

// Пол пользователя
export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

//Интересы пользователя
export enum Interest {
    MALE = "male",
    FEMALE = "female",
    ANY = "any"
}

//Данные пользователя
export interface UserData {
    name?: string;
    age?: number;
    bio?: string;
    photo?: string;
    gender?: Gender;
    interest?: Interest,
    state?: UserState,
    createAt: Date,
    updateAt: Date
}

// Callback данные для кнопок
export interface CallbackData {
    action: string;
    value?: string;
}

// Контекст с пользователем
export interface BotContext extends Context {
    userData?: UserData
}

// Результат валидации
export interface ValidationResult {
    isValid: boolean,
    error?: string
}





