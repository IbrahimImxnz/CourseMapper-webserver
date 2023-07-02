const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");
const User = db.user;
const Role = db.role;
const Course = db.course;
const Topic = db.topic;
const Channel = db.channel;
const Annotation = db.annotation;
const Material = db.material;
const Reply = db.reply;
const Tag = db.tag;
const Activity = db.activity;
const BlockingNotification = db.blockingNotification;

//write a method to make a new document in the blockingNotification collection. The argumetns for the method will be the courseID and the userID. and according to the notifications variables in the course document set the notifications variables for the materials, channels, topics.

export const initialiseNotificationSettings = async (course, user) => {
  console.log("initialiseNotificationSettings working");
  let userCourses = user.courses;
  let courseUserEnrolledTo = userCourses.find((userCourse) => {
    return userCourse.courseId.equals(course._id);
  });
  let userCourseUpdateNotificationSetting =
    courseUserEnrolledTo.isCourseUpdateNotificationsEnabled;
  let userAnnotationNotificationSetting =
    courseUserEnrolledTo.isAnnotationNotificationsEnabled;
  let userReplyAndMentionedNotificationSetting =
    courseUserEnrolledTo.isReplyAndMentionedNotificationsEnabled;

  console.log(
    "userCourseUpdateNotificationSetting",
    userCourseUpdateNotificationSetting
  );
  console.log(
    "userAnnotationNotificationSetting",
    userAnnotationNotificationSetting
  );
  console.log(
    "userReplyAndMentionedNotificationSetting",
    userReplyAndMentionedNotificationSetting
  );

  //fetch the topics of the course to get the channels
  let topicIds = course.topics;
  let topics = await Topic.find({ _id: { $in: topicIds } });
  let channelIds = [];
  topics.forEach((topic) => {
    channelIds = channelIds.concat(topic.channels);
  });
  let channels = await Channel.find({ _id: { $in: channelIds } });
  let materialIds = [];
  channels.forEach((channel) => {
    materialIds = materialIds.concat(channel.materials);
  });

  //loop over all the topicIds, channelIds, and materialIds and set the 3 notification settings for each of them
  let blockingNotificationTopics = topicIds.map((topicId) => {
    return {
      topicId: topicId,
      isCourseUpdateNotificationsEnabled: userCourseUpdateNotificationSetting,
      isAnnotationNotificationsEnabled: userAnnotationNotificationSetting,
      isReplyAndMentionedNotificationsEnabled:
        userReplyAndMentionedNotificationSetting,
    };
  });
  let blockingNotificationChannels = channelIds.map((channelId) => {
    return {
      channelId: channelId,
      isCourseUpdateNotificationsEnabled: userCourseUpdateNotificationSetting,
      isAnnotationNotificationsEnabled: userAnnotationNotificationSetting,
      isReplyAndMentionedNotificationsEnabled:
        userReplyAndMentionedNotificationSetting,
    };
  });

  let blockingNotificationMaterials = materialIds.map((materialId) => {
    return {
      materialId: materialId,
      isCourseUpdateNotificationsEnabled: userCourseUpdateNotificationSetting,
      isAnnotationNotificationsEnabled: userAnnotationNotificationSetting,
      isReplyAndMentionedNotificationsEnabled:
        userReplyAndMentionedNotificationSetting,
    };
  });

  console.log("blockingNotificationTopics", blockingNotificationTopics);
  console.log("blockingNotificationChannels", blockingNotificationChannels);
  console.log("blockingNotificationMaterials", blockingNotificationMaterials);

  let blockingNotification = new BlockingNotification({
    userId: user._id,
    courseId: course._id,
    topics: blockingNotificationTopics,
    channels: blockingNotificationChannels,
    materials: blockingNotificationMaterials,
  });

  blockingNotification = await blockingNotification.save();
  return blockingNotification;
};

module.exports = {
  initialiseNotificationSettings,
};
