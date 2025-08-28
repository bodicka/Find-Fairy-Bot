import { validAge, validateBio, validateName } from "@/validation";

//Группа тестов для validation
describe("validation", () => {
  //Группа тестов для функции validateName
  describe("validateName", () => {
    //проверяем, что валидное имя проходит проверку
    it("should validate valid name", () => {
      //Валидация имени
      const result = validateName("Boris");
      //Положительный результат
      expect(result.isValid).toBe(true);
      //Ошибки нет
      expect(result.error).toBeUndefined();
    });
    //проверяем, что пустое имя не проходит проверку
    it("shold reject empty name", () => {
      const result = validateName("");
      //Проверяем результат
      expect(result.isValid).toBe(false);
      //Проверяем, что возвращается правильное сообщение об ошибке
      expect(result.error).toBe("Имя не может быть пустым");
    });
    //проверяем, что имя, состоящее только из пробелов, не проходит проверку
    it("should reject whitespace-only name", () => {
      const result = validateName("   ");
      ////Проверяем результат отрицательный
      expect(result.isValid).toBe(false);
      //Проверяем, что возвращается правильное сообщение об ошибке
      expect(result.error).toBe("Имя не может быть пустым");
    });
    //Тест: проверяем, что слишком длинное имя не проходит проверку
    it("shold reject name exceeding max length", () => {
      const longName = "A".repeat(51); //Создаем имя длиной 51 символ, повторяем 51 раз букву A
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Имя слишком длинное. Максимум 50 символов");
    });
    // Тест: проверяем, что имя максимально допустимой длины проходит проверку
    it("shold accept name at max length boundary", () => {
      const longName = "A".repeat(50); //Создаем имя длиной 50 символ, повторяем 50 раз букву A
      const result = validateName(longName);
      expect(result.isValid).toBe(true);
      //Ошибки нет
      expect(result.error).toBeUndefined();
    });
  });

  describe("validAge", () => {
    //Тест: проверяем, что валидный возраст проходит проверку
    it("should validate valid age", () => {
      const ageUser = validAge(25);
      expect(ageUser.isValid).toBe(true);
      expect(ageUser.error).toBeUndefined();
    });
    //Тест: проверяем, что возраст ниже минимального не проходит проверку
    it("should reject age below minimum", () => {
      const result = validAge(9);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Возраст должен быть от 10 до 100 лет");
    });
    // Тест: проверяем, что возраст выше максимального не проходит проверку
    it("should reject age above maximum", () => {
      const result = validAge(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Возраст должен быть от 10 до 100 лет");
    });
    // Тест: проверяем, что возраст на границах допустимых значений проходит проверку
    it("should accept age at boundaries", () => {
      const minAge = validAge(10);
      const maxAge = validAge(100);
      //Проверка валидации возраста на границе допуска
      expect(minAge.isValid).toBe(true);
      expect(maxAge.isValid).toBe(true);
      //Обработчик ошибки
      expect(minAge.error).toBeUndefined();
      expect(maxAge.error).toBeUndefined();
    });
    //Тест: проверяем, что NaN не проходит проверку
    it("should reject NaN age", () => {
      const result = validAge(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Возраст должен быть от 10 до 100 лет");
    });
  });

  // Группа тестов для функции validateBio
  describe("validateBio", () => {
    // Тест: проверяем, что валидное описание проходит проверку
    it("should validate valid bio", () => {
      const result = validateBio("I am a software developer"); // Вызываем функцию с валидным описанием
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
    //проверяем, что валидное описание не проходит проверку
    it("should reject bio exceeding max length", () => {
      const result = validateBio("A".repeat(501));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "Описание слижком длинное. Максимум 500 символов"
      );
    });
    //проверяет, что пустое описание не проходит проверку
    it("should reject empty bio", () => {
      const result = validateBio("");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Описание не может быть пустым");
    });
    //описание только из пробелов, не проходит валидацию
    it("should reject whitespace-only bio", () => {
      const result = validateBio("   ");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Описание не может быть пустым");
    });
    //проверяем, что описание максимально допустимой длины проходит проверку
    it("should accept bio at max length boundary", () => {
      const validBio = validateBio("A".repeat(500));
      expect(validBio.isValid).toBe(true);
      expect(validBio.error).toBeUndefined();
    });
  });
});
