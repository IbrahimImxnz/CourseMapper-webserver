const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");

const UserNotification = db.userNotifications;
const User = db.user;
const UserCourseSubscriber = db.userCourseSubscriber;
const UserChannelSubscriber = db.userChannelSubscriber;
const UserTopicSubscriber = db.userTopicSubscriber;
const Course = db.course;

export const getAllNotifications = async (req, res, next) => {
  console.log("endpoint: getAllNotifications");
  const userId = req.userId;

  // Get all notifications for user by populating the activityId
  let notifications;
  try {
    notifications = await UserNotification.find({
      userId: new ObjectId(userId),
    }).populate("activityId", [
      "notificationInfo.userName",
      "notificationInfo.userShortname",
      "notificationInfo.courseName",
      "notificationInfo.topicName",
      "notificationInfo.channelName",
      "notificationInfo.category",
      "notificationInfo.materialType",
      "statement.object.definition.extensions",
      "statement.object.id",
      "statement.object.definition.type",
      "statement.verb.display.en-US",
      "statement.object.definition.name.en-US",
      "statement.timestamp",
    ]);
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error finding notifications", error });
  }

  console.log("notifications: ", notifications);
  return res.status(200).send(notifications);
};

export const deleteAllNotifications = async (req, res, next) => {
  console.log("endpoint: deleteAllNotifications");
  const userId = req.userId;

  // Delete all notifications for user
  try {
    await UserNotification.deleteMany({});
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error deleting notifications", error });
  }

  return res.status(200).send({ message: "Notifications deleted" });
};

export const markNotificationsAsRead = async (req, res, next) => {
  console.log("endpoint: markNotificationsAsRead");
  //request body contains an array of strings of the notification ids
  const notificationIds = req.body.notificationIds;
  console.log("notificationIds: ", notificationIds);
  console.log(req.body);

  try {
    //User notifications with the id's in the variable notificationIds are updated to have the isRead field set to true
    await UserNotification.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true }
    );
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error updating notifications", error });
  }

  return res.status(200).send({ message: "Notifications marked as read!" });
};

export const markNotificationsAsUnread = async (req, res, next) => {
  console.log("endpoint: markNotificationsAsUnread");
  //request body contains an array of strings of the notification ids
  const notificationIds = req.body.notificationIds;

  try {
    //User notifications with the id's in the variable notificationIds are updated to have the isRead field set to true
    await UserNotification.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: false }
    );
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error updating notifications", error });
  }

  return res.status(200).send({ message: "Notification/s marked as unread!" });
};

export const starNotification = async (req, res, next) => {
  console.log("endpoint: starNotification");
  //request body contains an array of strings of the notification ids
  const notificationIds = req.body.notificationIds;

  try {
    //User notifications with the id's in the variable notificationIds are updated to have the isRead field set to true
    await UserNotification.updateMany(
      { _id: { $in: notificationIds } },
      { isStar: true }
    );
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error updating notifications", error });
  }

  return res.status(200).send({ message: "Notification/s starred!" });
};

export const unstarNotification = async (req, res, next) => {
  console.log("endpoint: unstarNotification");
  //request body contains an array of strings of the notification ids
  const notificationIds = req.body.notificationIds;

  try {
    //User notifications with the id's in the variable notificationIds are updated to have the isRead field set to true
    await UserNotification.updateMany(
      { _id: { $in: notificationIds } },
      { isStar: false }
    );
  } catch (error) {
    return res

      .status(500)
      .send({ error: "Error updating notifications", error });
  }

  return res.status(200).send({ message: "Notification/s unstarred!" });
};

//the below function deletes the rows from the userNotifications table
export const removeNotification = async (req, res, next) => {
  const notificationIds = req.body.notificationIds;

  try {
    await UserNotification.deleteMany({ _id: { $in: notificationIds } });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error deleting notifications", error });
  }
};

export const subscribeChannel = async (req, res, next) => {
  console.log("endpoint: subscribeChannel");
  const userId = req.userId;
  const channelId = req.body.channelId;
  const courseId = req.body.courseId;

  // Check if user is already subscribed to channel
  let userChannelSubscriber;
  try {
    userChannelSubscriber = await UserChannelSubscriber.findOne({
      userId: new ObjectId(userId),
      channelId: new ObjectId(channelId),
    });

    if (userChannelSubscriber) {
      return res
        .status(400)
        .send({ error: "User is already subscribed to channel" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error in checking if user is already subscribed!" });
  }

  // Create new user channel subscriber
  const newUserChannelSubscriber = new UserChannelSubscriber({
    userId: new ObjectId(userId),
    channelId: new ObjectId(channelId),
    courseId: new ObjectId(courseId),
  });

  try {
    await newUserChannelSubscriber.save();
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error saving new user channel subscriber", error });
  }

  return res.status(200).send({ message: "User subscribed to channel" });
};

export const unsubscribeChannel = async (req, res, next) => {
  console.log("endpoint: unsubscribeChannel");
  const userId = req.userId;
  const channelId = req.body.channelId;

  let userChannelSubscriber;
  try {
    userChannelSubscriber = await UserChannelSubscriber.findOne({
      userId: new ObjectId(userId),
      channelId: new ObjectId(channelId),
    });

    if (userChannelSubscriber) {
      // Delete user channel subscriber
      try {
        await UserChannelSubscriber.findOneAndDelete({
          userId: new ObjectId(userId),
          channelId: new ObjectId(channelId),
        });
        return res.status(200).send({ message: "User unsubscribed" });
      } catch (error) {
        return res
          .status(500)
          .send({ error: "Error deleting user channel subscriber", error });
      }
    } else {
      return res
        .status(400)
        .send({ error: "User is already not subscribed to channel" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error in checking if user is already subscribed!" });
  }
};

export const subscribeTopic = async (req, res, next) => {
  console.log("endpoint: subscribeTopic");
  const userId = req.userId;
  const topicId = req.body.topicId;
  const courseId = req.body.courseId;

  // Check if user is already subscribed to topic
  let userTopicSubscriber;
  try {
    userTopicSubscriber = await UserTopicSubscriber.findOne({
      userId: new ObjectId(userId),
      topicId: new ObjectId(topicId),
    });

    if (userTopicSubscriber) {
      return res
        .status(400)
        .send({ error: "User is already subscribed to topic" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error in checking if user is already subscribed!" });
  }

  //create new user topic subscriber
  const newUserTopicSubscriber = new UserTopicSubscriber({
    userId: new ObjectId(userId),
    topicId: new ObjectId(topicId),
    courseId: new ObjectId(courseId),
  });

  try {
    await newUserTopicSubscriber.save();
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error saving new user Topic subscriber", error });
  }

  return res.status(200).send({ message: "User subscribed to Topic" });
};

//unsubscribe from a topic
export const unsubscribeTopic = async (req, res, next) => {
  console.log("endpoint: unsubscribeTopic");
  const userId = req.userId;
  const topicId = req.body.topicId;

  let userTopicSubscriber;
  try {
    userTopicSubscriber = await UserTopicSubscriber.findOne({
      userId: new ObjectId(userId),
      topicId: new ObjectId(topicId),
    });

    if (userTopicSubscriber) {
      // Delete user topic subscriber
      try {
        await UserTopicSubscriber.findOneAndDelete({
          userId: new ObjectId(userId),
          topicId: new ObjectId(topicId),
        });
        return res.status(200).send({ message: "User unsubscribed" });
      } catch (error) {
        return res
          .status(500)
          .send({ error: "Error deleting user topic subscriber", error });
      }
    } else {
      return res
        .status(400)
        .send({ error: "User is already not subscribed to topic" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error in checking if user is already subscribed!" });
  }
};

export const subscribeCourse = async (req, res, next) => {
  console.log("endpoint: subscribeCourse");
  const userId = req.userId;
  const courseId = req.body.courseId;

  let foundCourse;
  try {
    foundCourse = await Course.findById(courseId);
    if (!foundCourse) {
      return res.status(404).send({
        error: `Course with id ${courseId} doesn't exist!`,
      });
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }

  let foundUser;
  try {
    foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).send({
        error: `User not found!`,
      });
    }
  } catch (err) {
    return res.status(500).send({ error: "Error finding user" });
  }

  // Check if user is already subscribed to course

  try {
    let userCourseSubscriber;
    userCourseSubscriber = await UserCourseSubscriber.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });

    if (userCourseSubscriber) {
      return res
        .status(400)
        .send({ error: "User is already subscribed to course" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Error in checking if user is already subscribed!" });
  }

  //populate the UserCourseSubscriber table. it will contain the userId and courseId
  let userCourseSubscriber = new UserCourseSubscriber({
    userId: foundUser._id,
    courseId: foundCourse._id,
  });
  try {
    await userCourseSubscriber.save();
  } catch (err) {
    return res.status(500).send({ error: "Error saving userCourseSubscriber" });
  }
  //populate the UserTopicSubscriber table. For every topic that the foundCourse contains, add a document to the table. each document contains the userId and the topicId and the courseId
  const userTopicSubscribers = foundCourse.topics.map((topic) => {
    return new UserTopicSubscriber({
      userId: foundUser._id,
      topicId: topic._id,
      courseId: foundCourse._id,
    });
  });

  try {
    await UserTopicSubscriber.insertMany(userTopicSubscribers);
  } catch (err) {
    return res.status(500).send({ error: "Error saving userTopicSubscribers" });
  }

  //populate the UserChannelSubscriber table. For every channel that the foundCourse contains, add a document to the table. each document contains the userId and the courseId and the channelId
  const userChannelSubscribers = foundCourse.channels.map((channel) => {
    return new UserChannelSubscriber({
      userId: foundUser._id,
      channelId: channel._id,
      courseId: foundCourse._id,
    });
  });

  try {
    await UserChannelSubscriber.insertMany(userChannelSubscribers);
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Error saving userChannelSubscribers" });
  }

  res.status(200).send({ message: "User subscribed to course" });
};

export const unsubscribeCourse = async (req, res, next) => {
  console.log("endpoint: unsubscribeCourse");
  const userId = req.userId;
  const courseId = req.body.courseId;

  let foundCourse;
  try {
    foundCourse = await Course.findById(courseId);
    if (!foundCourse) {
      return res.status(404).send({
        error: `Course with id ${courseId} doesn't exist!`,
      });
    }
  } catch (err) {
    return res.status(500).send({ error: "Error finding course" });
  }
  let foundUser;
  try {
    foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).send({
        error: `User not found!`,
      });
    }
  } catch (err) {
    return res.status(500).send({ error: "Error finding user" });
  }

  //delete the UserCourseSubscriber document
  try {
    await UserCourseSubscriber.deleteOne({
      userId: foundUser._id,
      courseId: foundCourse._id,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Error deleting userCourseSubscriber" });
  }

  //delete the UserTopicSubscriber documents
  try {
    await UserTopicSubscriber.deleteMany({
      userId: foundUser._id,
      courseId: foundCourse._id,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Error deleting userTopicSubscribers" });
  }

  //delete the UserChannelSubscriber documents
  try {
    await UserChannelSubscriber.deleteMany({
      userId: foundUser._id,
      courseId: foundCourse._id,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Error deleting userChannelSubscribers" });
  }

  res.status(200).send({ message: "User unsubscribed from course" });
};

export const searchUsers = async (req, res, next) => {
  const { courseId, partialString } = req.query;
  const searchQuery = partialString ? partialString : "";
  try {
    const users = await User.find({
      "courses.courseId": courseId,
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { firstname: { $regex: searchQuery, $options: "i" } },
        { lastname: { $regex: searchQuery, $options: "i" } },
      ],
    }).limit(10);

    if (users.length === 0) {
      return res.json([]);
    }
    const suggestions = users.map((user) => ({
      name: user.firstname + " " + user.lastname,
      username: user.username,
    }));

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
