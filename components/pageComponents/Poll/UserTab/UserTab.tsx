import { Avatar, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsCardList } from "react-icons/bs";
import { BsChat } from "react-icons/bs";

const picUrl =
  "http://res.cloudinary.com/rahmad12/image/upload/v1624323417/PoldIt/Users/607a4e285e6edca820460bef/profile/profilePic.jpg";
export const UserTab = () => {
  return (
    <Box bg="white">
      <Scrollbars style={{ height: "790px" }}>
        {Array.from(Array(20).keys()).map((x) => (
          <UserListItem key={x} id={x} />
        ))}
      </Scrollbars>
    </Box>
  );
};

const UserListItem = ({ id }: { id: number }) => {
  return (
    <Box bg="#f2f2f2" my="2" mx={[1, 1, 3]} borderRadius="lg">
      <Flex
        py="4"
        px={[1, 1, 4]}
        align="center"
        justify="space-around"
        pr={[1, 1, 4, 4, 24]}
      >
        <Flex align="center">
          <IconButton
            icon={<AiOutlinePlusCircle size="23px" />}
            aria-label="thumbsup"
            variant="ghost"
            _focus={{ outline: "none" }}
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            size="sm"
            color="gray.800"
            mr={[1, 1, 4]}
          />
          <Box>
            <Avatar name="xav dave" src={picUrl} size="md" cursor="pointer" />
          </Box>
        </Flex>
        <Box>
          <Text color="gray.600" fontSize={["sm", "sm", "md"]}>
            rahmad12 {id + 1}
          </Text>
        </Box>
        <Flex ml="6" align="center">
          <BsCardList size="20px" style={{ marginTop: "2px" }} />
          <Text color="gray.600" ml="2" fontSize={["xs", "xs", "sm"]}>
            229
          </Text>
        </Flex>
        <Flex align="center">
          <BsChat size="20px" />
          <Text color="gray.600" ml="2" fontSize={["xs", "xs", "sm"]}>
            129
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
