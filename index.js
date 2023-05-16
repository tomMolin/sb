const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("sequelize");
const db = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));


app.get('/api/games', async (req, res) => {
  try {
    const games = await db.Game.findAll()
    return res.send(games)
  } catch (err) {
    console.error('There was an error querying games', err);
    return res.send(err);
  }
})

app.post('/api/games', async (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***There was an error creating a game', err);
    return res.status(400).send(err);
  }
})

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id))
    await game.destroy({ force: true })
    return res.send({ id: game.id  })
  } catch (err) {
    console.error('***Error deleting game', err);
    return res.status(400).send(err);
  }
});

app.put('/api/games/:id', async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.findByPk(id)
    await game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***Error updating game', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/search', async (req, res) => {
  const { name, platform} = req.body;
  try {
    const games = await db.Game.findAll({
      where: {
        name: {
          [sequelize.Op.like]: `%${name}%`
        },
        ...(platform && {platform})
      }
      });

    return res.send(games)
  } catch (err) {
    console.error('***Error searching games', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/populate', async (req, res) => {
  try{

    const iosApps = require('./ios.top100.json');
    const androidApps = require('./android.top100.json');
    const data = iosApps.concat(androidApps);
    const appData = data.reduce((acc, groupedApp) => {
        return acc.concat(groupedApp.map(appContent => {
          return {
            publisherId: String(appContent.publisher_id),
          name: appContent.name,
          platform: appContent.os,
          storeId: String(appContent.id),
          bundleId: String(appContent.bundle_id),
          appVersion: appContent.version,
          isPublished: !!appContent.publisher_id};
        }));
      }, []);
    await db.Game.bulkCreate(appData);


    res.status(204).send();
  } catch (err) {
    console.error('***Error populating games', err);
    return res.status(400).send(err);
  }
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
