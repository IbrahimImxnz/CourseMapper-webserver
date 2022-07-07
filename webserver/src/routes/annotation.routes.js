const { authJwt, authAdmin } = require("../middlewares");
const controller = require("../controllers/annotation.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // TODO:  Later, isAdmin middleware needs to be removed.
  //        A new middleware will be required to check whether a user is the creator of the course.
  //        Only authorized creator can update the courses. Maybe update the isModerator middleware
  app.post(
    "/new-annotation/:materialId",
    [authJwt.verifyToken],
    controller.newAnnotation
  );

  app.delete(
    "/delete-annotation/:annotationId",
    [authJwt.verifyToken, authAdmin],
    controller.deleteAnnotation
  );

  app.post(
    "/edit-annotation/:annotationId",
    [authJwt.verifyToken],
    controller.editAnnotation
  );

  app.post(
    "/like-annotation/:annotationId",
    [authJwt.verifyToken],
    controller.likeAnnotation
  );

  app.post(
    "/dislike-annotation/:annotationId",
    [authJwt.verifyToken],
    controller.dislikeAnnotation
  );
};
