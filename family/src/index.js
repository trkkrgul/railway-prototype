import express from 'express';
import dotenv from 'dotenv';
import { redisConnection } from './utils/redis.js';
import { connectToDB } from './utils/database.js';
import TrainLineModel from './models/TrainLine.js';
import TrainModel from './models/TrainModel.js';
dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
  connectToDB()
    .then((db) => {
      console.log(`Connected to database`);
    })

    .catch((error) => {
      console.error('Error connecting to database: ', error);
    });
  redisConnection.on('connect', () => {
    console.log('Connected to Redis');
  });
  redisConnection.on('error', (error) => {
    console.error('Error connecting to Redis: ', error);
  });

  console.log(
    `Server:family ${process.env.FAMILY_NAME} is running on port ${process.env.PORT}`
  );
});
