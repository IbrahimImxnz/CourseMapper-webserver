const { authJwt } = require("../middlewares");
const controller = require("../controllers/topic.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Get details of a topic
  // Only enrolled users can view topic
  app.get(
    "/courses/:courseId/topics/:topicId",
    [authJwt.verifyToken, authJwt.isEnrolled],
    controller.getTopic
  );

  // Create a new topic
  // Only moderator/admin
  app.post(
    "/courses/:courseId/topic",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.newTopic
  );

  // Delete a topic
  // Only moderator/admin
  app.delete(
    "/courses/:courseId/topics/:topicId",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteTopic
  );

  // Edit a topic
  // Only moderator/admin
  app.put(
    "/courses/:courseId/topics/:topicId",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.editTopic
  );
};
