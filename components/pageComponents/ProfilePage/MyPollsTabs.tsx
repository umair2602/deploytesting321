import { useRouter } from "next/router";
import { images, data } from "../Other/NavBar/data";
import { useQuery, useLazyQuery } from "@apollo/client";
import TimeAgo from "react-timeago";
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
  Spinner,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineMessage } from "react-icons/ai";
import { BiShareAlt, BiMessage, BiSelectMultiple } from "react-icons/bi";
import { RiFilePaper2Line } from "react-icons/ri";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { useEffect, useState } from "react";
import GraphResolvers from "../../../lib/apollo/apiGraphStrings";
import Cookies from "js-cookie";

interface MyPollsTabProps {
  userId: string | string[];
}

export const MyPollsTab = ({ userId }: MyPollsTabProps) => {

  const { data: myPolls, loading: myPollsLoading } = useQuery(
    GraphResolvers.queries.GET_USERPOLLS,
    {
      variables: {userId},
      // fetchPolicy: "cache-first",
      // nextFetchPolicy: "cache-and-network",
    }
  );

  // pollsByUser from the backend Query will be used here!
  //-----------------------------------------------------
  //-----------------------------------------------------
  //-----------------------------------------------------
  //-----------------------------------------------------
  //-----------------------------------------------------

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  //   () => setLoading(true);
  // }, []);

  // useEffect(() => {
  //   console.log("My Polls Are -->", myPolls);
  // }, [myPolls]);

  return (
    <Box mt="8">
      {myPollsLoading ? (
        <Flex key={"pollsLoading"} justify="center" align="center" minH="300px">
          <Spinner size="lg" color="poldit.100" />
        </Flex>
      ) : myPolls.pollsByUser.length > 0 ? (
        myPolls.pollsByUser.map((x: any) => (
          <PollCard key={x._id} pollData={x} />
        ))
      ) : (
        <h1 key={"noPollsFound"}>
          No Polls Found. Use the New Poll feature to add polls about topics and
          subtopics that interest you. You can see all your created polls here
        </h1>
      )}
    </Box>
  );
};

export const PollCard = ({ pollData }: any) => {
  const router = useRouter();

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
          creator={pollData?.creator}
          creationDate={pollData?.creationDate}
        />
        <Box py="5" px={[0, 2, 2]} mr={[6, 6, 8, 10, 16]}>
          <Text
            fontSize={["sm", "sm", "md"]}
            color="gray.800"
            onClick={() => router.push("/poll")}
            cursor="pointer"
            _hover={{ color: "blue.500" }}
            noOfLines={4}
          >
            {pollData.question}
          </Text>
          {pollData.images && (
            <Flex mt="4">
              {images.map((x, id) => (
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
          )}
        </Box>
        <PollCardFooter
          isMultiChoice={pollData.pollType === "multiChoice"}
          views={pollData.views}
          chatMessages={20}
          answers={2}
        />
      </Box>
    </Box>
  );
};

interface PollCardFooterProps {
  isMultiChoice: boolean;
  views: number;
  chatMessages: number;
  answers: number;
}

const PollCardFooter = ({
  isMultiChoice,
  views,
  chatMessages,
  answers,
}: PollCardFooterProps) => {
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
          Music
        </Tag>
        <Tag fontWeight="bold" color="gray.500" size="sm" borderRadius="full">
          Rap
        </Tag>
        <Tag fontWeight="bold" color="gray.500" size="sm" borderRadius="full">
          Hiphop
        </Tag>
        <Tag fontWeight="bold" color="gray.500" size="sm" borderRadius="full">
          Dubstep
        </Tag>
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
              {views}
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
              {chatMessages}
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
              {answers}
            </Text>
          </Flex>
        </Tooltip>
        {!isMultiChoice ? (
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

interface PollCardHeaderProps {
  creator: any;
  creationDate: string;
}

const PollCardHeader = ({ creator, creationDate }: PollCardHeaderProps) => {
  return (
    <Flex justify="space-between">
      <Flex>
        <Avatar name="xav dave" src={creator?.profilePic ?? ""} border="none" />
        <Flex direction="column" justify="center" pl="4">
          <Text fontSize="xs" color="gray.500" fontWeight="bold">
            {creator?.appid ?? "Anonymous"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            <TimeAgo date={creationDate} live={false} />
          </Text>
        </Flex>
      </Flex>
      <HStack align="flex-start" pr="2" mt="1">
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
