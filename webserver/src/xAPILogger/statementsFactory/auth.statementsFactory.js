import { v4 as uuidv4 } from "uuid";

export const getLoginStatement = (user, origin) => {
  let userId = user._id.toString();
  const fullname = `${user.firstname} ${user.lastname}`;
  return {
    id: uuidv4(),
    timestamp: new Date(),
    actor: {
      objectType: "Agent",
      name: userId,
      account: {
        homePage: origin,
        name: userId,
      },
    },
    verb: {
      id: "https://brindlewaye.com/xAPITerms/verbs/loggedin/",
      display: {
        "en-US": "logged in",
      },
    },
    object: {
      objectType: "Activity",
      id: `${origin}/activity/CourseMapper`,
      definition: {
        type: "http://id.tincanapi.com/activitytype/lms",
        name: {
          "en-US": "CourseMapper",
        },
        description: {
            "en-US": "Course Annotation and Analytics platform"
        }
      },
    },
    context: {
      platform: "CourseMapper",
      language: "en-US",
    },
  };
};

export const getLogoutStatement = (user, origin) => {
  let userId = user._id.toString();
  const fullname = `${user.firstname} ${user.lastname}`;
  return {
    id: uuidv4(),
    timestamp: new Date(),
    actor: {
      objectType: "Agent",
      name: userId,
      account: {
        homePage: origin,
        name: userId,
      },
    },
    verb: {
      id: "https://brindlewaye.com/xAPITerms/verbs/loggedout/",
      display: {
        "en-US": "logged out",
      },
    },
    object: {
      objectType: "Activity",
      id: `${origin}/activity/CourseMapper`,
      definition: {
        type: "http://id.tincanapi.com/activitytype/lms",
        name: {
          "en-US": "CourseMapper",
        },
        description: {
            "en-US": "Course Annotation and Analytics platform"
        }
      },
    },
    context: {
      platform: "CourseMapper",
      language: "en-US",
    },
  };
};

export const getSignupStatement = (user, origin) => {
  let userId = user._id.toString();
  const fullname = `${user.firstname} ${user.lastname}`;
  return {
    id: uuidv4(),
    timestamp: new Date(),
    actor: {
      objectType: "Agent",
      name: userId,
      account: {
        homePage: origin,
        name: userId,
      },
    },
    verb: {
      id: "http://adlnet.gov/expapi/verbs/registered",
      display: {
        "en-US": "registered",
      },
    },
    object: {
      objectType: "Activity",
      id: `${origin}/activity/CourseMapper`,
      definition: {
        type: "http://id.tincanapi.com/activitytype/lms",
        name: {
          "en-US": "CourseMapper",
        },
        description: {
            "en-US": "Course Annotation and Analytics platform"
        }
      },
    },
    context: {
      platform: "CourseMapper",
      language: "en-US",
    },
  };
};
