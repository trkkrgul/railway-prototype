export const FAMILIES = [
  'yenikapi-haciosman',
  'kadikoy-tavsantepe',
  'kabatas-mecidiyekoy',
  'uskudar-cekmekoy',
];

export const TRAIN_STATUS = [
  'out-of-service', //cannot be pending by family workers.
  'pending', //initializing to be ready to start
  'running', //moving
  'waiting', // in a station
  'finished', //reached to the last station
  'stopped', //stopped by the driver (maybe for switch changes)
  'crashed', //crashed to another train. or suicide
];
