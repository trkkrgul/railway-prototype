import express from 'express';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { connectToDB } from './utils/database.js';
import { redisConnection } from './utils/redis.js';
dotenv.config();

const app = express();

const FAMILIES = [
  {
    label: 'Yenikapı-Hacıosman',
    name: 'yenikapi-haciosman',
    port: 4001,
  },
  {
    label: 'Kadıköy-Tavşantepe',
    name: 'kadikoy-tavsantepe',
    port: 4002,
  },
  {
    label: 'Kabataş-Mecidiyeköy',
    name: 'kabatas-mecidiyekoy',
    port: 4003,
  },
  {
    label: 'Üsküdar-Çekmeköy',
    name: 'uskudar-cekmekoy',
    port: 4004,
  },
];

const families = new Map(
  FAMILIES.map((f) => [
    f.name,
    {
      ...f,
      active: false,
    },
  ])
);

app.post('/activate-family-worker', (req, res) => {
  const familyName = req.query.name;
  const family = families.get(familyName);
  if (!family) {
    res.status(404).send('Family not found');
    return;
  }
  if (family.active) {
    return res.status(400).send('Family worker already exists');
  }

  const command = `docker run -d --name ${family.name} --network railway-network \
  -e FAMILY_NAME=${familyName} \
  -e PORT=${family.port} \
  -e MONGODB_URL=${process.env.MONGODB_URL} \
  -e REDIS_URL=${process.env.REDIS_URL} \
  -p ${family.port}:${family.port} family_worker_image`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.log(stderr);
      return res.status(500).send(err);
    }
    if (stdout) {
      family.active = true;
      return res.send(stdout);
    }
    res.send(stdout);
  });
});

app.post('/delete-family-worker', (req, res) => {
  const familyName = req.query.name;
  const family = families.get(familyName);
  if (!family) {
    return res.status(404).send('Family not found');
  }
  if (!family.active) {
    return res.status(400).send('Family worker is not active');
  }

  const command = `docker rm -f ${family.name}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.log(stderr);
      return res.status(500).send(err);
    }
    if (stdout) {
      family.active = false;
      return res.send(stdout);
    }
    res.send(stdout);
  });
});

app.get('/families', (req, res) => {
  const data = Array.from(families.values()).map((f) => ({
    ...f,
    active: f.active ? 'Active' : 'Inactive',
  }));
  res.json(data);
});

const checkActiveFamilies = () => {
  families.forEach((family) => {
    // Check if the container exists (including exited containers)
    exec(`docker ps -a -q -f name=${family.name}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Error executing docker ps -a: ', err);
        return;
      }

      if (stdout) {
        // The container exists, now check if it is running
        exec(
          `docker inspect -f '{{.State.Running}}' ${family.name}`,
          (inspectErr, inspectStdout, inspectStderr) => {
            if (inspectErr) {
              console.log('Error inspecting container: ', inspectErr);
              return;
            }

            if (inspectStdout.trim() === 'true') {
              // Container is running, mark as active
              family.active = true;
              console.log(`${family.name} is active and running`);
            } else {
              // Container exists but is not running, attempt to start it
              family.active = false;
              console.log(
                `${family.name} exists but is not running. Starting it...`
              );
              exec(
                `docker start ${family.name}`,
                (startErr, startStdout, startStderr) => {
                  if (startErr) {
                    console.log('Error starting container: ', startErr);
                  } else {
                    family.active = true;
                    console.log(`${family.name} has been started`);
                  }
                }
              );
            }
          }
        );
      } else {
        if (family.active) {
          // Container does not exist but is marked as active, mark it as inactive
          family.active = false;
          console.log(`${family.name} is switched off`);
        }
        // Container does not exist, mark it as inactive but do not create it
      }
    });
  });
};

setInterval(checkActiveFamilies, 1000 * 60 * 5); // Check every 5 minutes

app.listen(process.env.PORT, () => {
  connectToDB()
    .then((db) => {
      console.log(`Connected to database`);
    })

    .catch((error) => {
      console.error('Error connecting to database: ', error);
      process.exit(1);
    });
  redisConnection.on('connect', () => {
    console.log('Connected to Redis');
  });
  redisConnection.on('error', (error) => {
    console.error('Error connecting to Redis: ', error);
    process.exit(1);
  });

  console.log(`Server:manager is running on port ${process.env.PORT}`);
});
