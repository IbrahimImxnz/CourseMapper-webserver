const topicGenerator = require("../generator/topic-generator");
const lrs = require("../lrs/lrs");
const controller = require("../controller/activity-controller");
const ORIGIN = process.env.ORIGIN;
const notifications = require("../../middlewares/Notifications/notifications");

export const createTopicLogger = async (req, res, next) => {
  try {
    req.locals.activity = await controller.createActivity(
      topicGenerator.generateCreateTopicActivity(req),
      notifications.generateNotificationInfo(req),
    );
    next();
  } catch (err) {
    res.status(400).send({ error: "Error saving statement to mongo", err });
  }
};

export const deleteTopic = async (req, res, next) => {
  const origin = req.get("origin") ? req.get("origin") : ORIGIN;
  const statement = topicGenerator.getTopicDeletionStatement(
    req.locals.user,
    req.locals.topic,
    origin,
  );
  const notificationInfo = notifications.generateNotificationInfo(req);
  const sent = await lrs.sendStatementToLrs(statement);

  try {
    const activity = await controller.createActivityOld(
      statement,
      sent,
      notificationInfo,
    );
    req.locals.activity = activity;
  } catch (err) {
    res.status(500).send({ error: "Error saving statement to mongo", err });
  }
  next();
};

export const getTopic = async (req, res) => {
  const origin = req.get("origin") ? req.get("origin") : ORIGIN;
  const statement = topicGenerator.getTopicAccessStatement(
    req.locals.user,
    req.locals.topic,
    origin,
  );
  const sent = await lrs.sendStatementToLrs(statement);
  controller.createActivityOld(statement, sent);
  res.status(200).send(req.locals.response);
};

export const editTopic = async (req, res, next) => {
  const origin = req.get("origin") ? req.get("origin") : ORIGIN;
  const statement = topicGenerator.getTopicEditStatement(
    req.locals.user,
    req.locals.newTopic,
    req.locals.oldTopic,
    origin,
  );

  const notificationInfo = notifications.generateNotificationInfo(req);
  const sent = await lrs.sendStatementToLrs(statement);
  try {
    const activity = await controller.createActivityOld(
      statement,
      sent,
      notificationInfo,
    );
    req.locals.activity = activity;
  } catch (err) {
    res.status(500).send({ error: "Error saving statement to mongo", err });
  }
  next();
};
