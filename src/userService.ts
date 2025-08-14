import { UserData, UserState } from "./types";
//Record<Key:number Type:UserData>Хранилище пользователей
const userData: Record<number, UserData> = {};

// Создание нового пользователя
export function createUser(userId: number): UserData {
  const user: UserData = {
    state: UserState.NAME,
    createAt: new Date(),
    updateAt: new Date(),
  };
  userData[userId] = user;

  return user;
}

// Получение пользователя
export function getUser(userId: number): UserData | undefined {
  return userData[userId];
}

// Обновление пользователя
export function updateUser(
  userId: number,
  updates: Partial<UserData>
): UserData {
  const user = getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: UserData = {
    ...user,
    ...updates,
    updateAt: new Date(),
  };

  userData[userId] = updatedUser;
  return updatedUser;
}

// Удаление пользователя
export function deletedUser(userId: number): boolean {
  if (userData[userId]) {
    delete userData[userId];
    return true;
  }
  return false;
}

// Проверка завершенности анкеты
export function isProfileComplete(userId: number): boolean {
  const user = getUser(userId);
  return user?.state === UserState.COMPLETE; //Если user существует, возьми user.state, иначе верни undefined.
}
