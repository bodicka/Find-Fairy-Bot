import {
  handleStart,
  handleText,
  handleNameInput,
  handleAgeInput,
  handleBioInput,
  handlePhoto,
  handleGenderChoice,
  handleInterestChoice,
  handleProfile,
} from "../handlers";
import { UserState, Gender, Interest, UserData } from "../types";

// Мокаем все зависимости, чтобы изолировать тестируемые функции
jest.mock("../userService");
jest.mock("../validation");
jest.mock("../utils");
jest.mock("../constants", () => ({
  // Мокаем константы
  MESSAGE: {
    WELCOME: "Добро пожаловать!",
    USE_COMMANDS: "Используйте команды",
    NICE_TO_MEET: "Приятно познакомиться, {name}",
    TELL_ABOUT_YOURSELF: "Расскажи о себе",
    SEND_PHOTO: "Отправь фото",
    CHOOSE_GENDER: "Выбери пол",
    CHOOSE_INTEREST: "Выбери интерес",
    PHOTO_REQUIRED: "Сначала отправь фото",
    ERROR_OCCURRED: "Произошла ошибка",
    PROFILE_INCOMPLETE: "Профиль не завершен",
  },
  genderButton: { reply_markup: { inline_keyboard: [] } }, // Кнопки выбора пола
  interestButton: { reply_markup: { inline_keyboard: [] } }, // Кнопки выбора интереса
}));

const mockUserService = require("../userService");
const mockValidation = require("../validation");
const mockUtils = require("../utils");

describe("handlers", () => {
  let mockCtx: any; // Переменная для хранения мока контекста

  beforeEach(() => {
    // Эта функция выполняется перед каждым тестом
    jest.clearAllMocks(); // Очищаем все моки
    // Создаем мок контекста с базовыми свойствами
    mockCtx = {
      from: { id: 123 },
      message: { text: "test" },
      reply: jest.fn(),
      editMessageText: jest.fn().mockResolvedValue(undefined),
      answerCbQuery: jest.fn(),
      replyWithPhoto: jest.fn(),
      callbackQuery: { data: "male" },
    };
    // Настраиваем моки по умолчанию
    mockUserService.createUser.mockReturnValue({ state: UserState.NAME }); // Создание пользователя
    mockUserService.getUser.mockReturnValue({ state: UserState.NAME }); // Получение пользователя
    mockUserService.updateUser.mockImplementation(
      (id: number, updates: Partial<UserData>) => ({
        // Обновление пользователя
        ...updates,
        state: updates.state,
      })
    );
    mockValidation.validateName.mockReturnValue({ isValid: true });
    mockValidation.validAge.mockReturnValue({ isValid: true });
    mockValidation.validateBio.mockReturnValue({ isValid: true });
    mockUtils.formateProfile.mockReturnValue("Formatted Profile");
  });

  describe("handleStart", () => {
    it("should create user and send welcome message", () => {
      handleStart(mockCtx); // Вызываем обработчик старта
      // Проверяем, что был создан пользователь с правильным ID
      expect(mockUserService.createUser).toHaveBeenCalledWith(123); //Проверь, что функция createUser была вызвана именно с аргументом 123
      expect(mockCtx.reply).toHaveBeenCalledWith("Добро пожаловать!");
    });
  });
  describe("handleText", () => {
    // Тест: проверяем обработку состояния ввода имени
    it("should handle name input state", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.NAME }); // Пользователь в состоянии ввода имени
      handleText(mockCtx); // Вызываем обработчик текста
      // Проверяем, что был вызван ответ (через handleNameInput)
      expect(mockCtx.reply).toHaveBeenCalled();
    });
    // Тест: проверяем обработку состояния ввода возраста
    it("should handle age input state", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.AGE }); // Пользователь в состоянии ввода возраста
      handleText(mockCtx); // Вызываем обработчик текста
      // Проверяем, что был вызван ответ (через handleAgeInput)
      expect(mockCtx.reply).toHaveBeenCalled();
    });
    // Тест: проверяем обработку состояния ввода описания
    it("should hanlder bio input state", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.BIO }); // Пользователь в состоянии ввода о себе
      handleText(mockCtx); // Вызываем обработчик текста
      // Проверяем, что был вызван ответ (через handleBioInput)
      expect(mockCtx.reply).toHaveBeenCalled();
    });
    // Тест: проверяем обработку неизвестного состояния
    it("should send use commands message for unknow state", () => {
      mockUserService.getUser.mockReturnValue({ state: "UNKNOWN" }); // Пользователь в неизвестном состоянии
      handleText(mockCtx); // Вызываем обработчик текста
      // Проверяем, что было отправлено сообщение о использовании команд
      expect(mockCtx.reply).toHaveBeenCalledWith("Используйте команды");
    });
  });
  // Группа тестов для функции handleNameInput
  describe("handleNameInput", () => {
    // Тест: проверяем успешную обработку валидного имени
    it("should handle valid name input", () => {
      // Устанавливаем текст сообщения
      mockCtx.message = { text: "Misha" };
      // Имя валидно
      mockValidation.validateName.mockReturnValue({ isValid: true });
      // Вызываем обработчик
      handleNameInput(mockCtx, { state: UserState.NAME });
      // Проверяем, что пользователь был обновлен с правильными данными
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        name: "Misha",
        state: UserState.AGE,
      });
      // Проверяем, что было отправлено сообщение знакомства
      expect(mockCtx.reply).toHaveBeenCalledWith(
        "Приятно познакомиться, Misha"
      );
    });
    // Тест: проверяем обработку невалидного имени
    it("should handle invalid name input", () => {
      mockCtx.message = { text: "" }; // Устанавливаем пустой текст
      mockValidation.validateName.mockReturnValue({
        isValid: false,
        error: "Имя не может быть пустым",
      }); // Имя невалидно
      handleNameInput(mockCtx, { state: UserState.NAME }); // Вызываем обработчик
      // Проверяем, что было отправлено сообщение об ошибке
      expect(mockCtx.reply).toHaveBeenCalledWith("Имя не может быть пустым");
      // Проверяем, что пользователь НЕ был обновлен
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });
  });
  // Группа тестов для функции handleAgeInput
  describe("hanleAgeInput", () => {
    // Тест: проверяем успешную обработку валидного возраста
    it("should handle valid age input", () => {
      mockCtx.message = { text: "25" }; // Устанавливаем текст сообщения
      mockValidation.validAge.mockReturnValue({ isValid: true }); // Возраст валиден
      handleAgeInput(mockCtx, { state: UserState.AGE }); // Вызываем обработчик
      // Проверяем, что пользователь был обновлен с правильными данными
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        age: 25,
        state: UserState.BIO,
      });
      // Проверяем, что было отправлено сообщение о рассказе о себе
      expect(mockCtx.reply).toHaveBeenCalledWith("Расскажи о себе");
    });
    // Тест: проверяем обработку невалидного возраста
    it("should handle invalid age input", () => {
      mockCtx.message = { text: "" }; // Устанавливаем текст сообщения
      mockValidation.validAge.mockReturnValue({
        // Возраст не валиден
        isValid: false,
        error: "Неверный возраст",
      });
      // Вызываем обработчик
      handleAgeInput(mockCtx, { state: UserState.AGE });
      // Проверяем, что было отправлено сообщение об ошибке
      expect(mockCtx.reply).toHaveBeenCalledWith("Неверный возраст");
      // Проверяем, что пользователь НЕ был обновлен
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });
  });
  // Группа тестов для функции handleBioInput
  describe("handleBioInput", () => {
    //Тест: проверяем успешную обработку валидного описания
    it("should handle valid bio input", () => {
      mockCtx.message = { text: "I am developer" }; // Устанавливаем текст сообщения
      mockValidation.validateBio.mockReturnValue({ isValid: true }); // BIO валиден
      handleBioInput(mockCtx, { state: UserState.BIO }); // Вызываем обработчик
      // Проверяем, что пользователь был обновлен с правильными данными
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        bio: "I am developer",
        state: UserState.PHOTO,
      }),
        // Проверяем, что было отправлено сообщение Отправь фото
        expect(mockCtx.reply).toHaveBeenCalledWith("Отправь фото");
    });
    //Тест: проверяем обработку не валидного описания
    it("should handle invalid bio input", () => {
      mockCtx.message = { text: "" };
      mockValidation.validateBio.mockReturnValue({
        isValid: false,
        error: "Описание не может быть пустым",
      });
      handleBioInput(mockCtx, { state: UserState.BIO });
      expect(mockCtx.reply).toHaveBeenCalledWith(
        "Описание не может быть пустым"
      );
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });
    //Тест: проверяем обработку не валидного описания больше 500 символов
    it("should handle invalid bio more than 500 characters", () => {
      mockCtx.message = { text: "A".repeat(501) };
      mockValidation.validateBio.mockReturnValue({
        isValid: false,
        error: "Описание слишком длинное. Максимум 500 символов.",
      });
      handleBioInput(mockCtx, { state: UserState.BIO });
      expect(mockCtx.reply).toHaveBeenCalledWith(
        "Описание слишком длинное. Максимум 500 символов."
      );
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });
  });
  // Группа тестов для функции handlePhoto
  describe("handlePhoto", () => {
    // Тест: проверяем успешную обработку фото в правильном состоянии
    it("should handle photo it correct state", () => {
      mockCtx.message = { photo: [{ file_id: "photo123" }] }; // Устанавливаем фото
      mockUserService.getUser.mockReturnValue({ state: UserState.PHOTO }); // Пользователь в состоянии отправки фото
      handlePhoto(mockCtx); // Вызываем обработчик
      // Проверяем, что пользователь был обновлен с фото и переведен в состояние выбора пола
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        photo: "photo123",
        state: UserState.GENDER,
      });
      // Проверяем, что было отправлено сообщение о выборе пола
      expect(mockCtx.reply).toHaveBeenCalledWith(
        "Выбери пол",
        expect.any(Object)
      );
    });
    // Тест: проверяем обработку фото в неправильном состоянии
    it("should require photo in wrong state", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.NAME });
      handlePhoto(mockCtx); // Вызываем обработчик
      // Проверяем, что было отправлено сообщение о необходимости фото
      expect(mockCtx.reply).toHaveBeenCalledWith("Сначала отправь фото");
    });
  });
  // Группа тестов для функции handleGenderChoice
  describe("handleGenderChoice", () => {
    // Тест: проверяем успешную обработку выбора пола
    it("should handle gender choice correctly", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.GENDER }); // Пользователь в состоянии выбора пола
      mockCtx.callbackQuery = { data: "male" }; // Выбран мужской пол
      handleGenderChoice(mockCtx); // Вызываем обработчик
      // Проверяем, что пользователь был обновлен с полом и переведен в состояние выбора интереса
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        gender: "male",
        state: UserState.INTEREST,
      });
      // Проверяем, что сообщение было заменено на выбор интереса
      expect(mockCtx.editMessageText).toHaveBeenCalledWith(
        "Выбери интерес",
        expect.any(Object)
      );
    });
  });
  // Группа тестов для функции handleInterestChoice
  describe("handleInterestChoice", () => {
    // Тест: проверяем успешную обработку выбора интереса
    it("should handle interest choice correctly", () => {
      mockUserService.getUser.mockReturnValue({ state: UserState.INTEREST });
      mockCtx.callbackQuery = { data: "interest_female" };
      mockUserService.updateUser.mockReturnValue({
        photo: "photo123",
        state: UserState.COMPLETE,
      });
      handleInterestChoice(mockCtx);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(123, {
        interest: "female",
        state: UserState.COMPLETE,
      });
      expect(mockCtx.replyWithPhoto).toHaveBeenCalledWith("photo123", {
        caption: "Formatted Profile",
      });
    });
  });
  // Группа тестов для функции handleProfile
  describe("handleProfile", () => {
    it("should show complete profile", () => {
      mockUserService.getUser.mockReturnValue({
        state: UserState.COMPLETE,
        photo: "photo123",
      });
      handleProfile(mockCtx);
      expect(mockCtx.replyWithPhoto).toHaveBeenCalledWith("photo123", {
        caption: "Formatted Profile",
      });
    });
  });
});
