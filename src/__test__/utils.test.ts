import { formateProfile, getInterestText } from "../utils";
import { Gender, Interest } from "../types";

// Мокаем модуль constants, чтобы не зависеть от реальных констант
jest.mock("../constants", () => ({
  DISPLAY_TEXTS: {
    MALE_BOY: "Парень",
    FEMALE_GIRL: "Девушка",
    MALE_INTEREST: "Парни",
    FEMALE_INTEREST: "Девушки",
    ANY_INTEREST: "Все",
  },
}));
// Группа тестов для модуля utils
describe("utils", () => {
  // Группа тестов для функции formateProfile
  describe("formateProfile", () => {
    //Тест: проверяем форматирование профиля мужчины
    it("should formate male user profile correctly", () => {
      const user = {
        name: "Misha",
        age: 25,
        gender: Gender.MALE,
        interest: Interest.FEMALE,
        bio: "Full-stack Develop",
        photo: "photo_id", // ID фото
        state: "COMPLETE" as any, // Состояние профиля
        createAt: new Date(),
        updateAt: new Date(),
      };
      const result = formateProfile(user); // Вызываем функцию форматирования
      expect(result).toContain("Твоя Анкета:"),
        expect(result).toContain("Имя: Misha"),
        expect(result).toContain("Возраст: 25"),
        expect(result).toContain("Пол: Парень"),
        expect(result).toContain("Интерес: Девушки"),
        expect(result).toContain("О себе: Full-stack Develop");
    });
    it("should formate female user profile correctly", () => {
      const user = {
        name: "Anna",
        age: 18,
        gender: Gender.FEMALE,
        interest: Interest.MALE,
        bio: "It's male",
        photo: "photo_id",
        state: "COMPLETE" as any,
        createAt: new Date(),
        updateAt: new Date(),
      };
      const result = formateProfile(user);

      expect(result).toContain("Твоя Анкета:");
      expect(result).toContain("Имя: Anna");
      expect(result).toContain("Возраст: 18");
      expect(result).toContain("Пол: Девушка");
      expect(result).toContain("Интерес: Парни");
      expect(result).toContain("О себе: It's male");
    });
  });

  describe("getInterestText", () => {
    // Тест: проверяем получение текста для интереса к женщинам
    it("should return correct text from female interest", () => {
      const result = getInterestText(Interest.FEMALE);
      expect(result).toContain("Девушки");
    });
    // Тест: проверяем получение текста для интереса к мужчинам
    it("should return correct text from male interest", () => {
      const result = getInterestText(Interest.MALE);
      expect(result).toBe("Парни");
    });
    // Тест: проверяем получение текста для интереса ко всем
    it("should return correct text from any interest", () => {
      const result = getInterestText(Interest.ANY);
      expect(result).toBe("Все");
    });
    // Тест: проверяем получение текста по умолчанию для неопределенного интереса
    it("should return default text from undefined interest", () => {
      const result = getInterestText(undefined);
      expect(result).toBe("Все");
    });
  });
});
