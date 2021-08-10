import { ResolverMap, SearchResults } from "../../components/appTypes/appType";
import {
  transformPoll,
  transformAnswer,
  transformTopic,
  transformSubTopic,
} from "./shared";
import Poll from "../../models/PollModel";
import Answer from "../../models/answerModel";
import Topic from "../../models/TopicModel";
import SubTopic from "../../models/SubTopicModel";

import configs from "../../endpoints.config";
import IPoll from "../../models/interfaces/poll";
import ISubTopic from "../../models/interfaces/subTopic";
import ITopic from "../../models/interfaces/topic";

export const otherResolvers: ResolverMap = {
  Query: {
    statesUS: async (parent, args, ctx) => {
      const response = await (
        await fetch(
          `https://v3.openstates.org/jurisdictions?classification=state&apikey=${configs.StatesAPIKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json();

      if (response.results) {
        return response.results;
      }
    },
    searchAll: async (parent, args, ctx) => {
      const { isAuth, req, res, dataLoaders } = ctx;

      const { searchVal = null, page = 1, limit = 20 } = args;

      let searchQuery = {};

      const models = [
        {
          searchParam: "question",
          model: Poll,
          transform: transformPoll,
          loaders: ["user", "topic", "subTopic", "answer", "chat"],
        },
        {
          searchParam: "answer",
          model: Answer,
          transform: transformAnswer,
          loaders: ["user", "poll"],
        },
        {
          searchParam: "topic",
          model: Topic,
          transform: transformTopic,
          loaders: ["user", "subTopic"],
        },
        {
          searchParam: "subTopic",
          model: SubTopic,
          transform: transformSubTopic,
          loaders: ["user", "topic", "poll"],
        },
      ];

      try {
        const searchResults: { [key: string]: any } = {};

        for (let i = 0; i < models.length; i++) {
          const { searchParam, model, transform, loaders } = models[i];

          if (
            (searchVal && searchParam === "topic") ||
            (searchVal && searchParam === "subTopic")
          ) {
            searchQuery = {
              $or: [
                { [searchParam]: { $regex: searchVal, $options: "i" } },
                { description: { $regex: searchVal, $options: "i" } },
              ],
            };
          } else {
            searchQuery = {
              $or: [{ [searchParam]: { $regex: searchVal, $options: "i" } }],
            };
          }

          const resp = await model
            .find(searchQuery)
            .limit(limit)
            .skip((page - 1) * limit);
          // .lean();

          const count = await model.countDocuments(searchQuery);

          const respData = await Promise.all(
            resp.map(async (item) => {
              if (searchParam === "topic" || searchParam === "subTopic") {
                const trueSearchParam =
                  searchParam === "subTopic" ? `${searchParam}s` : searchParam;

                const pollCount = await Poll.where({
                  [trueSearchParam]: { $in: [item._id] },
                }).countDocuments();

                item._doc.pollCount = pollCount;
              }

              return transform(item, dataLoaders(loaders));
            })
          );

          searchResults[searchParam] = { [searchParam]: respData, count };
        }

        return searchResults;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {},
};