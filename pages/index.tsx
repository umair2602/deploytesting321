import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import GraphResolvers from "../lib/apollo/apiGraphStrings";
import { PollHistory } from "../components/appTypes/appType";
import { SitePageContainer } from "../components/layout";
import { HomeBtnWindow } from "../components/pageComponents/Home";
import DataWindow from "../components/pageComponents/Home/DataWindow";

import AppLoading from "../components/pageComponents/Other/Loading";
import { useAuth } from "../components/authProvider/authProvider";

const { GET_NEWEST_POLLS, GET_ACTIVE_CHATS, GET_TRENDING_POLLS } =
  GraphResolvers.queries;

const Home = () => {
  const router = useRouter();
  const auth = useAuth();

  const { data: newPollData } = useQuery(GET_NEWEST_POLLS);
  const { data: activeChats } = useQuery(GET_ACTIVE_CHATS);
  const { data: trendingPolls } = useQuery(GET_TRENDING_POLLS);
  const [pollData, updatePollData] = useState<PollHistory[]>([]);

  useEffect(() => {
    auth?.handleSearch("");
    localStorage.removeItem("PoldIt-data");

    pollHandler("Active Chats");
  }, [newPollData, activeChats]);

  const pollHandler = async (sortType: string) => {
    if (sortType === "Newest Polls" && newPollData) {
      updatePollData(newPollData.newestPolls);
      return;
    }

    if (sortType === "Active Chats" && activeChats) {
      updatePollData(activeChats.activeChats);
      return;
    }

    if (sortType === "Trending Polls" && trendingPolls) {
      updatePollData(trendingPolls.trendingPolls);
    }
  };

  return (
    <SitePageContainer title={`${router.pathname} Home`}>
      <HomeBtnWindow sortPolls={pollHandler} />
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "170px" }}
      >
        {pollData ? (
          <DataWindow data={pollData} />
        ) : (
          <AppLoading
            message="Content Loading"
            style={{ height: "50px", width: "50px" }}
          />
        )}
      </div>
    </SitePageContainer>
  );
};

export default Home;
