import { LIMITS } from "./constants";

//Валидация Имени
export const validateName = (
  name: string
): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Имя не может быть пустым" };
  }

  if (name.length > LIMITS.MAX_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Имя слишком длинное. Максимум ${LIMITS.MAX_NAME_LENGTH} символов`,
    };
  }

  return { isValid: true };
};

//Валидация Возраста

export const validAge = (age: number): { isValid: boolean; error?: string } => {
  if (isNaN(age) || age < LIMITS.MIN_AGE || age > LIMITS.MAX_AGE) {
    return {
      isValid: false,
      error: `Возраст должен быть от ${LIMITS.MIN_AGE} до ${LIMITS.MAX_AGE} лет`,
    };
  }
  return { isValid: true };
};

//Валидация описания
export const validateBio = (
  bio: string
): { isValid: boolean; error?: string } => {
  if (!bio || bio.trim().length === 0) {
    return {
      isValid: false,
      error: "Описание не может быть пустым",
    };
  }
  if (bio.length > LIMITS.MAX_BIO_LENGTH) {
    return {
      isValid: false,
      error: `Описание слижком длинное. Максимум ${LIMITS.MAX_BIO_LENGTH} символов`,
    };
  }
  return { isValid: true };
};
