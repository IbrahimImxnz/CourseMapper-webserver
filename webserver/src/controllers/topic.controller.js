const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");
const Channel = db.channel;
const Course = db.course;
const Topic = db.topic;

/**
 * @function getTopic
 * Get details of a topic controller
 *
 * @param {string} req.params.topicId The id of the topic
 */
export const getTopic = (req, res) => {
  const topicId = req.params.topicId;
  Topic.findOne({_id: ObjectId(topicId)})
    .populate("channels", "-__v")
    .exec((err, foundTopic) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      res.status(200).send(foundTopic);
    });
};

/**
 * @function newTopic
 * Create a new topic controller
 *
 * @param {string} req.params.courseId The id of the course
 * @param {string} req.body.name The name of the topic, e.g., React Crash Course
 * @param {string} req.body.description The description of the course, e.g., Teaching students about modern web technologies
 * @param {string} req.userId The owner of the topic
 */
export const newTopic = (req, res) => {
  Course.findOne({_id: ObjectId(req.params.courseId)}, (err, foundCourse) => {
    if (err) {
      res.status(500).send({error: err});
      return;
    }

    if (!foundCourse) {
      res.status(404).send({
        error: `Course with id ${req.params.courseId} doesn't exist!`,
      });
      return;
    }

    const topic = new Topic({
      name: req.body.name,
      courseId: req.params.courseId,
      userId: req.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    topic.save((err, topic) => {
      if (err) {
        res.status(500).send({error: err});
        return;
      }

      res.send({id: topic._id, success: `New topic '${topic.name}' added!`});

      let topics = [];
      topics.push(topic._id);

      foundCourse.topics.push(topic._id);

      foundCourse.save((err) => {
        if (err) {
          res.status(500).send({error: err});
          return;
        }
      });
    });
  });
};

/**
 * @function deleteTopic
 * Delete a topic controller
 *
 * @param {string} req.params.topicId The id of the topic
 */
export const deleteTopic = (req, res) => {
  Topic.findByIdAndRemove({_id: req.params.topicId}, (err, foundTopic) => {
    if (err) {
      res.status(500).send({error: err});
      return;
    }

    if (!foundTopic) {
      res.status(404).send({
        error: `Topic with id ${req.params.topicId} doesn't exist!`,
      });
      return;
    }

    Channel.deleteMany({_id: {$in: foundTopic.channels}}, (err) => {
      if (err) {
        res.status(500).send({error: err});
        return;
      }
    });

    Course.findOne({_id: foundTopic.courseId}, (err, foundCourse) => {
      if (err) {
        res.status(500).send({error: err});
        return;
      }

      let filteredTopics = foundCourse.topics.filter(
        (topic) => topic.valueOf() !== req.params.topicId
      );
      foundCourse.topics = filteredTopics;

      foundCourse.save((err) => {
        if (err) {
          res.status(500).send({error: err});
          return;
        }
      });
    });

    res.send({success: `Topic '${foundTopic.name}' successfully deleted!`});
  });
};
