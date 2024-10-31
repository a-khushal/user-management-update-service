import express from "express";
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const app = express();
const client = new PrismaClient();

cron.schedule('*/10 * * * *', async () => {
  const currentDateTime = new Date();
  const today = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());

  try {
    const updatedSameDayQuizzes = await client.quiz.updateMany({
      where: {
        expired: false,
        date: today,
        endTime: {
          lt: currentDateTime
        }
      },
      data: {
        expired: true
      }
    });

    console.log(`Expired quizzes updated for same day condition: ${updatedSameDayQuizzes.count}`);

    const updatedPastDateQuizzes = await client.quiz.updateMany({
      where: {
        expired: false,
        date: {
          lt: today
        }
      },
      data: {
        expired: true
      }
    });

    console.log(`Expired quizzes updated for past date condition: ${updatedPastDateQuizzes.count}`);
  } catch (error) {
    console.error("Error updating quizzes:", error);
  }
});

app.listen(9000, () => {
  console.log("Server is up and running at port 9000");
});
