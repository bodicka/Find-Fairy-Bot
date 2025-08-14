import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import "dotenv/config";

import { 
  handleStart,
  handleText,
  handleProfile,
  handlePhoto,
  handleGenderChoice,
  handleInterestChoice,
 } from "./handlers";

 const bot = new Telegraf(process.env.BOT_TOKEN!);

// Обработчики команд
bot.start(handleStart);
bot.command("profile", handleProfile);

// Обработчики сообщений
bot.on(message("text"), handleText);
bot.on(message("photo"), handlePhoto);

// Обработчики callback запросов
bot.action(["male", "female"], handleGenderChoice);
bot.action(/^interest_(male|female|any)$/, handleInterestChoice);

bot
    .launch()
    .then(() => console.log("BOT_START"))
    .catch((e) => console.error(e))
