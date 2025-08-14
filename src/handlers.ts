import { Context } from "telegraf";
import { Gender, Interest, UserState } from "./types";
import { MESSAGE, genderButton, interestButton } from "./constants";
import { createUser, getUser, updateUser } from "./userService";
import { validateName, validAge, validateBio } from "./validation";
import { formateProfile } from "./utils";

//Обработчик команды /start
export const handleStart = (ctx: Context) => {
  const userId = ctx.from!.id;
  createUser(userId);
  ctx.reply(MESSAGE.WELCOME);
};

// Обработчик текстовых сообщений
export const handleText = (ctx: Context) => {
  const userId = ctx.from!.id;
  const currentUser = getUser(userId) || createUser(userId);

  switch (currentUser.state) {
    case UserState.NAME:
      handleNameInput(ctx, currentUser);
      break;
    case UserState.AGE:
      handleAgeInput(ctx, currentUser);
      break;
    case UserState.BIO:
      handleBioInput(ctx, currentUser);
      break;
    default:
      ctx.reply(MESSAGE.USE_COMMANDS);
  }
};

export const handleNameInput = (ctx: Context, user: any) => {
  const userId = ctx.from!.id;
  if (!ctx.message || !("text" in ctx.message)) return; //Если нет сообщения, или если в нём нет текста — ничего не делаем.
  const name = ctx.message.text;
  const validateon = validateName(name);

  if (!validateon.isValid) {
    return ctx.reply(validateon.error!);
  }

  updateUser(userId, {
    name: name,
    state: UserState.AGE,
  });

  ctx.reply(MESSAGE.NICE_TO_MEET.replace("{name}", name));
};
// Обработка ввода возраста
export const handleAgeInput = (ctx: Context, user: any) => {
  const userId = ctx.from!.id;
  if (!ctx.message || !("text" in ctx.message)) return;
  const age = parseInt(ctx.message!.text);
  const validate = validAge(age);

  if (!validate.isValid) {
    return ctx.reply(validate.error!);
  }

  updateUser(userId, {
    age: age,
    state: UserState.BIO,
  });

  ctx.reply(MESSAGE.TELL_ABOUT_YOURSELF);
};
// Обработка ввода "О себе"
export const handleBioInput = (ctx: Context, user: any) => {
  const userId = ctx.from!.id;
  if (!ctx.message || !("text" in ctx.message)) return;
  const bio = ctx.message!.text;
  const validate = validateBio(bio);

  if (!validate.isValid) {
    return ctx.reply(validate.error!);
  }
  updateUser(userId, {
    bio: bio,
    state: UserState.PHOTO,
  });
  ctx.reply(MESSAGE.SEND_PHOTO);
};
// Обработчик фото
export const handlePhoto = (ctx: Context) => {
  const userId = ctx.from!.id;
  const currentUser = getUser(userId);

  if (currentUser?.state === UserState.PHOTO) {
    if (!ctx.message || !("photo" in ctx.message)) return;
    const photo = ctx.message!.photo[0];
    const fileId = photo?.file_id;

    if (fileId) {
      updateUser(userId, {
        photo: fileId,
        state: UserState.GENDER,
      });
      return ctx.reply(MESSAGE.CHOOSE_GENDER, genderButton);
    }
  }
  return ctx.reply(MESSAGE.PHOTO_REQUIRED);
};
// Обработчик выбора пола
export const handleGenderChoice = (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const currentUser = getUser(userId);
  if (!currentUser || currentUser.state !== UserState.GENDER) return;

  const gender =
    "data" in ctx.callbackQuery! ? (ctx.callbackQuery.data as Gender) : null;
  if (!gender) return ctx.answerCbQuery(MESSAGE.ERROR_OCCURRED);

  updateUser(userId, {
    gender: gender,
    state: UserState.INTEREST,
  });

  return ctx
        .editMessageText(MESSAGE.CHOOSE_INTEREST, interestButton)
        .catch(() => ctx.answerCbQuery());
};

//Обработчик выбора интересов
export const handleInterestChoice = (ctx: Context) => {
  const userId = ctx.from!.id;
  if (!userId) return;

  const currentUser = getUser(userId);

  if (!currentUser || currentUser.state !== UserState.INTEREST) return;

  const match =
    "data" in ctx.callbackQuery!
      ? (ctx.callbackQuery.data as string).match(/^interest_(male|female|any)$/)
      : null;

  if (!match) return ctx.answerCbQuery(MESSAGE.ERROR_OCCURRED);

  const interest = match[1] as Interest;

  const updatedUsers = updateUser(userId, {
    interest: interest,
    state: UserState.COMPLETE,
  });

  const caption = formateProfile(updatedUsers);

  if (updatedUsers.photo) {
    return ctx.replyWithPhoto(updatedUsers.photo, { caption });
  } else {
    return ctx.reply(caption);
  }
};

//Обработчик команды /profile
export const handleProfile = (ctx: Context) => {
  const userId = ctx.from!.id;
  const currentUser = getUser(userId);

  if (!currentUser || currentUser.state !== UserState.COMPLETE) {
    return ctx.reply(MESSAGE.PROFILE_INCOMPLETE);
  }

  const caption = formateProfile(currentUser);

  if (currentUser.photo) {
    return ctx.replyWithPhoto(currentUser.photo, { caption });
  } else {
    return ctx.reply(caption);
  }
};

