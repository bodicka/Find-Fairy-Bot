import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import "dotenv/config";

const bot = new Telegraf(process.env.BOT_TOKEN!);

interface UserData {
  name?: string;
  age?: number;
  bio?: string;
  photo?: string;
  gender?: "male" | "female";
  interest?: "male" | "female" | "any";
  state: "name" | "age" | "bio" | "photo" | "gender" | "interest" | "complete";
}

const userData: Record<number, UserData> = {};

// Кнопки для выбора пола
const genderButton = Markup.inlineKeyboard([
  [Markup.button.callback("👨 Парень", "male")],
  [Markup.button.callback("👩 Девушка", "female")],
]);

// Кнопки для выбора предпочтений
const interestButton = Markup.inlineKeyboard([
  [Markup.button.callback("👨 Парни", "interest_male")],
  [Markup.button.callback("👩 Девушки", "interest_female")],
  [Markup.button.callback("🤷 Без разницы", "interest_any")],
]);

bot.start((ctx) => {
  const userId = ctx.from.id;
  userData[userId] = {
    state: "name",
  };
  ctx.reply("Привет! Давай создадим твою анкету. Как тебя зовут?");
});

// Обработка текстовых сообщений
bot.on(message("text"), (ctx) => {
  const userId = ctx.from.id;
  const currentUser = userData[userId] || { state: "name" };

  switch (currentUser.state) {
    case "name":
      userData[userId] = {
        ...currentUser,
        name: ctx.message.text,
        state: "age",
      };
      return ctx.reply(
        `Приятно познакомиться, ${ctx.message.text}! Сколько тебе лет?`
      );

    case "age":
      const age = parseInt(ctx.message.text);
      if (isNaN(age)) {
        return ctx.reply("Пожалуйста, введи число! Сколько тебе лет?");
      }
      userData[userId] = {
        ...currentUser,
        age: age,
        state: "bio",
      };
      return ctx.reply("Расскажи немного о себе:");

    case "bio":
      userData[userId] = {
        ...currentUser,
        bio: ctx.message.text,
        state: "photo",
      };
      return ctx.reply("Теперь пришли своё фото:");

    default:
      return ctx.reply("Используй команды для управления анкетой");
  }
});
// Обработка фото
bot.on(message("photo"), (ctx) => {
    const userId = ctx.from.id;
    const currentUser = userData[userId];

    if (currentUser?.state === "photo") {
        // Берем фото с максимальным качеством (первое в массиве)
        const photo = ctx.message.photo[0];
        const fileId = photo?.file_id;

        if (fileId) {
            userData[userId] = {
                ...currentUser,
                photo: fileId,
                state: "gender",
            };
            return ctx.reply("Выбери свой пол:", genderButton);
        }
    }
    return ctx.reply("Пожалуйста, пришли фото для анкеты");
});

// Обработка кнопок пола
bot.action(["male", "female"], (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const currentUser = userData[userId];
  if (!currentUser || currentUser.state !== "gender") return;

  const gender =
    "data" in ctx.callbackQuery
      ? (ctx.callbackQuery.data as "male" | "female")
      : null;

  if (!gender) return ctx.answerCbQuery("Ошибка обработки запроса");

  userData[userId] = {
    ...currentUser,
    gender: gender,
    state: "interest",
  };

  return ctx
    .editMessageText("Кто тебе интересен?", interestButton)
    .catch(() => ctx.answerCbQuery());
});
//Обработчик кнопок предпочтений
bot.action(/^interest_(male|female|any)$/, (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const currentUser = userData[userId];

  if (!currentUser || currentUser.state !== "interest") return;

  const match =
    "data" in ctx.callbackQuery
      ? (ctx.callbackQuery.data as string).match(/^interest_(male|female|any)$/)
      : null;

  if (!match) return ctx.answerCbQuery("Ошибка обработки запроса");

  const interest = match[1] as "male" | "female" | "any";

  userData[userId] = {
    ...currentUser,
    interest: interest,
    state: "complete",
  };

  let interestText = "";
  switch (interest) {
    case "male":
      interestText = "👨 Парни";
      break;
    case "female":
      interestText = "👩 Девушки";
      break;
    case "any":
      interestText = "🤷 Без разницы";
      break;
  }

  const caption = `Твоя анкета:\n\nИмя: ${currentUser.name}\nВозраст: ${
    currentUser.age
  }\nПол: ${
    currentUser.gender === "male" ? "👨 Парень" : "👩 Девушка"
  }\nИнтерес: ${interestText}\nО себе: ${currentUser.bio}`;

  // Отправляем анкету с фото
  if (currentUser.photo) {
    return ctx.replyWithPhoto(currentUser.photo, { caption });
  } else {
    return ctx.reply(caption);
  }
});

//Команда для просмотра анкеты
bot.command("profile", (ctx) => {
    const userId = ctx.from.id;
    const currentUser = userData[userId];

    if (!currentUser || currentUser.state !== "complete") {
        return ctx.reply("Сначала заполни анкету через /start");
    }

    const interestText = {
        male: "👨 Парни",
        female: "👩 Девушки",
        any: "🤷 Без разницы"
    }[currentUser.interest || 'any'];

    const caption = `Твоя анкета:\n\nИмя: ${currentUser.name}\nВозраст: ${currentUser.age}\nПол: ${
        currentUser.gender === "male" ? "👨 Парень" : "👩 Девушка"
    }\nИнтерес: ${interestText}\nО себе: ${currentUser.bio}`;

    // Отправляем анкету с фото
    if (currentUser.photo) {
        return ctx.replyWithPhoto(currentUser.photo, { caption });
    } else {
        return ctx.reply(caption);
    }
});

bot
  .launch()
  .then(() => console.log("BOT_COMPLETE"))
  .catch(() => console.log("BOT_ERROR"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
