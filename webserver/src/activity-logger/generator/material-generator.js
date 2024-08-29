import { v4 as uuidv4 } from "uuid";
import {
  createContext,
  createMetadata,
  createUser,
  createVerb,
} from "./util/generator-util";
import config from "./util/config";

const platform = "CourseMapper";
const language = "en-US";

const createMaterialObject = (req, typeURI) => {
  let material = req.locals.material;
  let origin = req.get("origin");
  let type = typeURI ? typeURI : [`${origin}/activityType/material`];
  return {
    objectType: config.activity,
    id: `${origin}/activity/course/${material.courseId}/topic/${material.topicId}/channel/${material.channelId}/material/${material._id}`,
    definition: {
      type: type,
      name: {
        [config.language]: material.name,
      },
      description: {
        [config.language]: material.description,
      },
      extensions: {
        [`${origin}/extensions/material`]: {
          id: material._id,
          name: material.name,
          description: material.description,
          type: material.type,
          url: material.url,
          channel_id: material.channelId,
          topic_id: material.topicId,
          course_id: material.courseId,
        },
      },
    },
  };
};

export const generateAddMaterialActivity = (req) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://activitystrea.ms/schema/1.0/add", "added"),
    object: createMaterialObject(req),
    context: createContext(),
  };
};

export const generateAccessMaterialActivity = (req, user, material, origin) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://activitystrea.ms/schema/1.0/access", "accessed"),
    object: createMaterialObject(req),
    context: createContext(),
  };
};

export const generateDeleteMaterialActivity = (req, user, material, origin) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://activitystrea.ms/schema/1.0/delete", "deleted"),
    object: createMaterialObject(req),
    context: createContext(),
  };
};

export const generateEditMaterialActivity = (req) => {
  const metadata = createMetadata();
  let updatedMaterial = req.locals.newMaterial;
  let materialToEdit = req.locals.oldMaterial;
  let origin = req.get("origin");
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://curatr3.com/define/verb/edited", "edited"),
    object: {
      objectType: config.activity,
      id: `${origin}/activity/course/${materialToEdit.courseId}/topic/${materialToEdit.topicId}/channel/${materialToEdit.channelId}/material/${materialToEdit._id}`,
      definition: {
        type: [`${origin}/activityType/material`],
        name: {
          [config.language]: materialToEdit.name,
        },
        description: {
          [config.language]: materialToEdit.description,
        },
        extensions: {
          [`${origin}/extensions/material`]: {
            id: materialToEdit._id,
            name: materialToEdit.name,
            description: materialToEdit.description,
            type: materialToEdit.type,
            url: materialToEdit.url,
            channel_id: materialToEdit.channelId,
            topic_id: materialToEdit.topicId,
            course_id: materialToEdit.courseId,
          },
        },
      },
    },
    result: {
      extensions: {
        [`${origin}/extensions/material`]: {
          name: updatedMaterial.name,
          description: updatedMaterial.description,
          url: updatedMaterial.url,
          type: updatedMaterial.type,
        },
      },
    },
    context: createContext(),
  };
};

const createVideoMaterialWithDurationObject = (req) => {
  const hours = req.params.hours;
  const minutes = req.params.minutes;
  const seconds = req.params.seconds;
  const material = req.params.material;
  const origin = req.get("origin");
  const duration =
    parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
  return {
    objectType: config.activity,
    id: `${origin}/activity/course/${material.courseId}/topic/${material.topicId}/channel/${material.channelId}/material/${material._id}`,
    definition: {
      type: `http://activitystrea.ms/schema/1.0/video`,
      name: {
        [config.language]: material.name,
      },
      description: {
        [config.language]: material.description,
      },
      extensions: {
        [`${origin}/extensions/material`]: {
          id: material._id,
          name: material.name,
          description: material.description,
          type: material.type,
          url: material.url,
          channel_id: material.channelId,
          topic_id: material.topicId,
          course_id: material.courseId,
          timestamp: duration,
        },
      },
    },
  };
};

export const generatePlayVideoActivity = (req) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://activitystrea.ms/schema/1.0/play", "played"),
    object: createVideoMaterialWithDurationObject(req),
    context: {
      platform: platform,
      language: language,
    },
  };
};

export const generatePauseVideoActivity = (req) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb("http://id.tincanapi.com/verb/paused", "paused"),
    object: createVideoMaterialWithDurationObject(req),
    context: {
      platform: platform,
      language: language,
    },
  };
};

export const generateCompleteVideoActivity = (req, user, material, origin) => {
  const metadata = createMetadata();
  return {
    ...metadata,
    actor: createUser(req),
    verb: createVerb(
      "http://activitystrea.ms/schema/1.0/complete",
      "completed",
    ),
    object: createMaterialObject(
      req,
      "http://activitystrea.ms/schema/1.0/video",
    ),
    context: createContext(),
  };
};

export const generateViewSlideActivity = (user, material, slideNr, origin) => {
  const userId = user._id.toString();
  const userFullname = `${user.firstname} ${user.lastname}`;
  return {
    id: uuidv4(),
    timestamp: new Date(),
    actor: {
      objectType: "Agent",
      name: userFullname,
      mbox: user.mbox,
      mbox_sha1sum: user.mbox_sha1sum,
      account: {
        homePage: origin,
        name: userId,
      },
    },
    verb: {
      id: "http://id.tincanapi.com/verb/viewed",
      display: {
        [language]: "viewed",
      },
    },
    object: {
      objectType: "Activity",
      id: `${origin}/activity/course/${material.courseId}/topic/${material.topicId}/channel/${material.channelId}/material/${material._id}/slide/${slideNr}`,
      definition: {
        type: `http://id.tincanapi.com/activitytype/slide`,
        name: {
          [language]: material.name,
        },
        description: {
          [language]: material.description,
        },
        extensions: {
          "http://www.CourseMapper.de/extensions/material": {
            id: material._id,
            name: material.name,
            pageNr: slideNr,
            description: material.description,
            type: material.type,
            url: material.url,
            channel_id: material.channelId,
            topic_id: material.topicId,
            course_id: material.courseId,
          },
        },
      },
    },
    context: {
      platform: platform,
      language: language,
    },
  };
};

export const generateCompletePdfActivity = (user, material, origin) => {
  const userId = user._id.toString();
  const userFullname = `${user.firstname} ${user.lastname}`;
  return {
    id: uuidv4(),
    timestamp: new Date(),
    actor: {
      objectType: "Agent",
      name: userFullname,
      mbox: user.mbox,
      mbox_sha1sum: user.mbox_sha1sum,
      account: {
        homePage: origin,
        name: userId,
      },
    },
    verb: {
      id: "http://activitystrea.ms/schema/1.0/complete",
      display: {
        [language]: "completed",
      },
    },
    object: {
      objectType: "Activity",
      id: `${origin}/activity/course/${material.courseId}/topic/${material.topicId}/channel/${material.channelId}/material/${material._id}`,
      definition: {
        type: `http://www.CourseMapper.de/activityType/pdf`,
        name: {
          [language]: material.name,
        },
        description: {
          [language]: material.description,
        },
        extensions: {
          "http://www.CourseMapper.de/extensions/material": {
            id: material._id,
            name: material.name,
            description: material.description,
            type: material.type,
            url: material.url,
            channel_id: material.channelId,
            topic_id: material.topicId,
            course_id: material.courseId,
          },
        },
      },
    },
    context: {
      platform: platform,
      language: language,
    },
  };
};
