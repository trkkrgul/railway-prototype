import mongoose from 'mongoose';
import { FAMILIES } from '../utils/constants.js';
const FAMILY_NAME = process.env.FAMILY_NAME;

const stationSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});
const routeSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  switch: {
    type: String,
    required: true,
  },
  switchFrom: {
    type: String,
    required: true,
  },
  switchTo: {
    type: String,
    required: true,
  },
});
const TrainLineSchema = new mongoose.Schema({
  route: [{ type: routeSchema, required: true }],
  stations: [{ type: stationSchema, required: true }],
  name: { type: String, required: true, enum: FAMILIES, unique: true },
});

const TrainLineModel = mongoose.model('TrainLine', TrainLineSchema);

const params = {
  route: [
    {
      branch: 'A',
      from: '0',
      to: '100',
      switch: 'SW1',
      switchFrom: 'A',
      switchTo: 'B',
    },
    {
      branch: 'B',
      from: '0',
      to: '100',
      switch: 'SW2',
      switchFrom: 'B',
      switchTo: 'C',
    },
    {
      branch: 'C',
      from: '0',
      to: '100',
      switch: 'SW3',
      switchFrom: 'C',
      switchTo: 'D',
    },
    {
      branch: 'D',
      from: '0',
      to: '100',
      switch: 'SW4',
      switchFrom: 'D',
      switchTo: 'E',
    },
  ],

  stations: [
    {
      branch: 'A',
      position: 25,
    },
    {
      branch: 'A',
      position: 50,
    },
    {
      branch: 'A',
      position: 75,
    },
    {
      branch: 'B',
      position: 25,
    },
    {
      branch: 'B',
      position: 50,
    },
    {
      branch: 'B',
      position: 75,
    },
    {
      branch: 'C',
      position: 25,
    },
    {
      branch: 'C',
      position: 50,
    },
    {
      branch: 'C',
      position: 75,
    },
    {
      branch: 'D',
      position: 25,
    },
    {
      branch: 'D',
      position: 50,
    },
    {
      branch: 'D',
      position: 75,
    },
  ],
  name: FAMILY_NAME,
};

TrainLineModel.create(params)
  .then(() => {
    console.log('TrainLine created');
  })
  .catch((error) => {
    const { code, keyValue } = error;
    if (code === 11000) {
      console.log(`TrainLine ${keyValue.name} already exists`);
    } else {
      console.error('Error creating TrainLine: ', error);
    }
  });

export default TrainLineModel;
