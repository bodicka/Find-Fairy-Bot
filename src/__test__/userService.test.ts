import {
  getUser,
  updateUser,
  deletedUser,
  isProfileComplete,
  createUser,
} from "../userService";
import { UserState } from "@/types";

describe("userService", () => {
  // Эта функция выполняется перед каждым тестом
  // Очищаем моки и сбрасываем модуль для изоляции тестов
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  //Группа тестов для функции createUser
  describe("createUser", () => {
    // Тест: проверяем создание пользователя с правильными значениями по умолчанию
    it("should create a new user with default state", () => {
      const userId = 123;
      const user = createUser(userId); // Вызываем функцию создания
      // Проверяем, что созданный пользователь имеет правильную структуру toEqual сравнивает объекты и возвращает true, если они равны, в противном случае — false.
      expect(user).toEqual({
        state: UserState.NAME,
        createAt: expect.any(Date),
        updateAt: expect.any(Date),
      });
    });
    //проверяем, что каждый пользователь создается с уникальными данными
    it("should create user with unique userId", () => {
      const user1 = createUser(1);
      const user2 = createUser(2);
      // Проверяем, что пользователи не одинаковые
      expect(user1).not.toBe(user2);
      // Проверяем, что время создания различается (хотя бы на миллисекунду)
      expect(getUser(1)).not.toBe(getUser(2));
    });
  });

  // Группа тестов для функции getUser
  describe("getUser", () => {
    it("should retunr user if exists", () => {
      //Тест: проверяем получение существующего пользователя
      const userId = 123; //id user
      const createdUser = createUser(userId); //создаем пользователя
      const retrievedUser = getUser(userId); //пытаемся получить usera
      // Проверяем, что полученный пользователь идентичен созданному
      expect(retrievedUser).toEqual(createdUser);
    });
    // Тест: проверяем, что для несуществующего пользователя возвращается undefined
    it("should retunr undefined if user does not exist", () => {
      const user = getUser(999);
      expect(user).toBeUndefined();
    });
  });

  //Тест для updateUser
  describe("updateUser", () => {
    it("should update existing user", () => {
      const userId = 123;
      createUser(userId);

      // Данные для обновления
      const update = {
        name: "Misha",
        age: 25,
        state: UserState.AGE,
      };
      const updatedUser = updateUser(userId, update); // Вызываем функцию обновления
      // Проверяем, что все поля обновились корректно
      expect(updatedUser.name).toBe("Misha");
      expect(updatedUser.age).toBe(25);
      expect(updatedUser.state).toBe(UserState.AGE);
      // Проверяем, что время обновления изменилось
      expect(updatedUser.updateAt).toBeInstanceOf(Date);
    });
    //проверяем, что при попытке обновить несуществующего пользователя выбрасывается ошибка
    it("shold throw error if user not found", () => {
      expect(() => {
        updateUser(999, { name: "Misha" });
      }).toThrow("User not found"); //toThrow пикает ошибку
    });
    // Тест: проверяем, что при обновлении сохраняются неизмененные поля
    it("should preserve existing fields when updating", () => {
      const userId = 123;
      const originalUser = createUser(userId);

      const updatedUser = updateUser(userId, { name: "Lima" });
      // Проверяем, что неизмененные поля остались прежними
      expect(updatedUser.state).toBe(originalUser.state);
      expect(updatedUser.createAt).toBe(originalUser.createAt);
      // Проверяем, что обновленное поле изменилось
      expect(updatedUser.name).toBe("Lima");
    });
  });

  //Группа тестов для функции deletedUser
  describe("deletedUser", () => {
    //проверяем успешное удаление существующего пользователя
    it("should deleted existing user and retunr true", () => {
      const userId = 123;
      createUser(userId);
      //Удаление пользователя
      const result = deletedUser(userId);
      //Проверяем что удаление прошло успешно.
      expect(result).toBe(true);
      //Проверяем что пользователь точно удалён
      expect(getUser(userId)).toBeUndefined();
    });
    // проверяем, что при попытке удалить несуществующего пользователя возвращается false
    it("should return false if user does not exist", () => {
      const result = deletedUser(999);
      expect(result).toBe(false);
    });
  });

  //Группа тестов для функции isProfileComplete
  describe("isProfileComplete", () => {
    //проверяем, что для завершенного профиля возвращается true
    it("should return true for complete profile", () => {
      const userId = 123;
      createUser(userId);
      // Переводим пользователя в завершенное состояние
      updateUser(userId, { state: UserState.COMPLETE });
      // Проверяем, что профиль считается завершенным
      const complete = isProfileComplete(userId);
      expect(complete).toBe(true);
    });
    //Тест: проверяем, что для незавершенного профиля возвращается false
    it("shold return false for incomplete profile", () => {
      const userId = 123;
      createUser(userId);
      // Проверяем, что профиль считается незавершенным
      const complete = isProfileComplete(userId);
      expect(complete).toBe(false);
    });
    //проверяем, что для несуществующего пользователя возвращается false
    it("should retunr false for non-existent user", () => {
      const complete = isProfileComplete(999);
      expect(complete).toBe(false);
    });
  });
});
