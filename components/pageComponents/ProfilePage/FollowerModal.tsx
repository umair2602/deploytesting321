import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const FollowerModal = ({ isOpen, onClose }: any) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [isOpen]);
  return (
    <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader align="center" borderBottom="1px solid #dbdbdb" p="2">
          Followers
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: "none" }} />
        <ModalBody maxH="600px">
          {loading ? (
            <Flex justify="center" align="center" minH="500px">
              <Spinner size="lg" color="poldit.100" />
            </Flex>
          ) : (
            <Box>
              {Array.from(Array(30).keys()).map((x) => (
                <Box key={x} mb="4">
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Avatar
                        name="Dan Abrahmov"
                        src="https://bit.ly/dan-abramov"
                      />
                      <Box ml="3">
                        <Text fontSize="sm" fontWeight="bold">
                          Dan Abrahmov
                        </Text>
                      </Box>
                    </Flex>
                    <Box>
                      <Button
                        variant="ghost"
                        _focus={{ outline: "none" }}
                        borderWidth="1px"
                        borderColor="#dbdbdb"
                        size="sm"
                      >
                        Follow
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
