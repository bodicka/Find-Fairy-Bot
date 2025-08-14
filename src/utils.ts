import { DISPLAY_TEXTS } from "./constants";
import { Gender, UserData, Interest } from "./types";

export const formateProfile = (user: UserData): string => {
  const genderOfUser =
    user.gender === Gender.MALE
      ? DISPLAY_TEXTS.MALE_BOY
      : DISPLAY_TEXTS.FEMALE_GIRL;
  const interestGenderOfUser = getInterestText(user.interest);

  return (
    `Твоя Анкета:\n\n` +
    `Имя: ${user.name}\n` +
    `Возраст: ${user.age}\n` +
    `Пол: ${genderOfUser}\n` +
    `Интерес: ${interestGenderOfUser}\n` +
    `О себе: ${user.bio}`
  );
};

export const getInterestText = (interest?: Interest): string => {
  switch (interest) {
    case Interest.MALE:
      return DISPLAY_TEXTS.MALE_INTEREST;
    case Interest.FEMALE:
      return DISPLAY_TEXTS.FEMALE_INTEREST;
    case Interest.ANY:
      return DISPLAY_TEXTS.ANY_INTEREST;
    default:
      return DISPLAY_TEXTS.ANY_INTEREST;
  }
};
