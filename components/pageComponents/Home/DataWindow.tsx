import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import styles from "../../../appStyles/appStyles.module.css";
import TimeAgo from "react-timeago";
import { PollHistory } from "../../appTypes/appType";
import PollMetrics from "../Other/PollMetrics";
import { TagWindow, UserTagWindow } from "../Other/Tags/Tags";
import {
  AiOutlineHeart,
  AiOutlineEye,
  AiTwotoneHeart,
  AiOutlineMessage,
} from "react-icons/ai";
import { BiShareAlt, BiMessage, BiSelectMultiple } from "react-icons/bi";
import { RiFilePaper2Line } from "react-icons/ri";
import { useMutation, useQuery } from "@apollo/client";
import GraphResolvers from "../../../lib/apollo/apiGraphStrings";
import { handleFavorite } from "lib/apollo/apolloFunctions/mutations";

const { appColor, appbg_other, appbg_secondary, dataWindow, dataItem } = styles;

export interface DataWindow {
  data: PollHistory[];
}

const DataWindow = ({ data }: DataWindow) => {
  return (
    <Box px="2" pt="2">
      {data?.map((item) => (
        <PollCard data={item} key={item._id} />
      ))}
    </Box>
  );
};

export default DataWindow;

interface ListItem {
  data: PollHistory;
}

const PollCard = ({ data }: ListItem) => {
  return (
    <Box mb="8">
      <Box
        bg="white"
        boxShadow="0 1px 10px -1px rgba(0,0,0,.2)"
        borderRadius="lg"
        pl="6"
        pr="2"
        pt="4"
        pb="4"
      >
        <PollCardHeader
          creator={data?.creator}
          creationDate={data?.creationDate}
          pollId={data?._id}
          isFavorite={data?.isFavorite}
        />
        <Box py="5" px={[0, 2, 2]} mr={[6, 6, 8, 10, 16]}>
          <Link href={`/Polls/${data?._id}`}>
            <Text
              fontSize={["sm", "sm", "md"]}
              color="gray.800"
              cursor="pointer"
              _hover={{ color: "blue.500" }}
              noOfLines={4}
            >
              {data.question}
            </Text>
          </Link>
          {data?.pollImages.length ? (
            <Flex mt="4">
              {data?.pollImages.map((x, id) => (
                <Box
                  key={id}
                  w="100px"
                  h="100px"
                  mr="2"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Image
                    src={x}
                    objectFit="cover"
                    objectPosition="center center"
                    h="100%"
                    w="100%"
                  />
                </Box>
              ))}
            </Flex>
          ) : null}
        </Box>
        <PollCardFooter data={data} />
      </Box>
    </Box>
  );
};

const PollCardHeader = ({ creator, creationDate, pollId, isFavorite }: any) => {
  const [favorite, setFavorite] = useState<boolean>();

  // Use Effects
  useEffect(() => {
    setFavorite(isFavorite);
  }, []);

  // Mutations ---------------------------------------------------------
  const [updateFavorite] = useMutation(
    GraphResolvers.mutations.HANDLE_FAVORITE
  );
  // Mutaions End ------------------------------------------------------

  // Functions ---------------------------------------------------------
  const favoriteHandler = (pollId: string) => {
    if (favorite !== undefined) {
      const favType = "Poll";

      handleFavorite(updateFavorite, !favorite, favType, pollId)
        .then(() => {
          // console.log("Process completed now fav is -->", !favorite);
        })
        .catch((err) => {
          console.log(err.message);
        });

      setFavorite((prevState) => {
        return !prevState;
      });
    }
  };

  // Functions End -----------------------------------------------------

  return (
    <Flex justify="space-between">
      <Flex>
        <Link href={`/Profile/${creator?._id}`}>
          <Avatar
            name="Poll Dit"
            src={creator?.profilePic}
            border="none"
            cursor="pointer"
          />
        </Link>
        <Flex direction="column" justify="center" pl="4">
          <Text fontSize="xs" color="gray.500">
            by {creator?.appid}
          </Text>
          <Text fontSize="xs" color="gray.500">
            <TimeAgo date={creationDate} live={false} />
          </Text>
        </Flex>
      </Flex>
      <HStack align="start" mt="1" pr="2">
        <IconButton
          aria-label="heart"
          icon={
            favorite ? (
              <AiTwotoneHeart size="22px" color="red" />
            ) : (
              <AiOutlineHeart size="22px" />
            )
          }
          bg="none"
          _hover={{ bg: "none" }}
          _focus={{ outline: "none" }}
          size="xs"
          onClick={() => favoriteHandler(pollId)}
        />
        <Popover placement="top">
          <PopoverTrigger>
            <IconButton
              aria-label="heart"
              icon={<BiShareAlt size="22px" />}
              bg="none"
              _hover={{ bg: "none" }}
              _focus={{ outline: "none" }}
              size="xs"
            />
          </PopoverTrigger>
          <PopoverContent
            _focus={{ outline: "none" }}
            w="100%"
            borderRadius="lg"
          >
            <PopoverArrow />
            <PopoverBody>
              <Flex justify="flex-start" align="center" px="4" py="2">
                <FacebookShareButton url="https://chakra-ui.com">
                  <FacebookIcon round={true} size="24px" />
                </FacebookShareButton>
                <Flex mx="4">
                  <TwitterShareButton url="https://chakra-ui.com">
                    <TwitterIcon round={true} size="24px" />
                  </TwitterShareButton>
                </Flex>
                <LinkedinShareButton url="https://chakra-ui.com">
                  <LinkedinIcon round={true} size="24px" />
                </LinkedinShareButton>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </Flex>
  );
};
const PollCardFooter = ({ data }: ListItem) => {
  const btnCommonStyle = {
    _active: { bg: "none" },
    _hover: { bg: "none" },
    _focus: { outline: "none" },
    size: "xs",
    color: "gray.500",
    bg: "none",
  };
  return (
    <Flex justify="space-between" wrap="wrap" gridRowGap="2" ml={[0, 0, 1]}>
      <Flex wrap="wrap" gridGap="2">
        <Tag
          fontWeight="bold"
          color="gray.100"
          size="sm"
          borderRadius="full"
          bg="gray.400"
        >
          {data?.topic?.topic}
        </Tag>
        {data?.subTopics.map((st) => (
          <Tag
            fontWeight="bold"
            color="gray.500"
            size="sm"
            borderRadius="full"
            key={st._id}
          >
            {st.subTopic}
          </Tag>
        ))}
      </Flex>

      <Flex align="center">
        <Tooltip label="Number of Views" placement="top" hasArrow>
          <Flex justify="center" align="center" mr="4">
            <IconButton
              aria-label="heart"
              icon={<AiOutlineEye size="18px" />}
              {...btnCommonStyle}
            />
            <Text fontSize="xs" color="gray.500">
              {data?.views}
            </Text>
          </Flex>
        </Tooltip>
        <Tooltip label="Number of Chat Messages" placement="top" hasArrow>
          <Flex justify="center" align="center" mr="4">
            <IconButton
              aria-label="heart"
              icon={<AiOutlineMessage size="18px" />}
              {...btnCommonStyle}
            />
            <Text fontSize="xs" color="gray.500">
              {data?.chatMssgs ? data?.chatMssgs.length : 0}
            </Text>
          </Flex>
        </Tooltip>
        <Tooltip label="Number of Answers" placement="top" hasArrow>
          <Flex justify="center" align="center" mr="2">
            <IconButton
              aria-label="heart"
              icon={<BiMessage size="18px" />}
              {...btnCommonStyle}
            />
            <Text fontSize="xs" color="gray.500">
              {data?.answers ? data?.answers.length : 0}
            </Text>
          </Flex>
        </Tooltip>

        {!data?.isMultipleChoice ? (
          <Tooltip label="Open Ended Poll" placement="top" hasArrow>
            <IconButton
              aria-label="heart"
              icon={<RiFilePaper2Line size="16px" />}
              mr="2"
              {...btnCommonStyle}
            />
          </Tooltip>
        ) : (
          <Tooltip label="Multi Choice Poll" placement="top" hasArrow>
            <IconButton
              aria-label="heart"
              icon={<BiSelectMultiple size="16px" />}
              mr="2"
              {...btnCommonStyle}
            />
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};
const ListItem = ({ data }: ListItem) => {
  return (
    <div className={`card m-2 ${dataItem}`} key={data._id}>
      <div className="">
        <h2
          style={{
            textAlign: "center",
            padding: "10px 5px",
            fontWeight: "bold",
          }}
        >
          {" "}
          {data.pollType === "openEnded"
            ? "Open Ended Poll"
            : data.pollType === "multiChoice"
            ? "Multichoice Poll"
            : "Unknown Type"}{" "}
        </h2>
        <div className="d-flex flex-row justify-content-between w-100 border-bottom p-2">
          <TagWindow
            pollId={data._id}
            topic={data.topic.topic}
            subTopics={data.subTopics}
          />
          <UserTagWindow user={data.creator} createdDate={data.creationDate} />
        </div>

        <p className="mt-3 mb-3 p-2 pl-3">{data.question}</p>
      </div>
      {data.pollImages && data.pollImages.length > 0 && (
        <div
          className={`d-flex flex-column align-items-center justify-content-center p-2 ${appbg_other}`}
        >
          {data.pollImages.map((item, idx) => (
            <div
              className={`d-inline-flex justify-content-center pt-2 pb-4`}
              key={idx}
            >
              <img
                src={item}
                style={{
                  height: "20vh",
                  width: "auto",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div className={`p-2 m-2 ${appbg_secondary}`}>
        <PollMetrics data={data} />
      </div>
    </div>
  );
};
