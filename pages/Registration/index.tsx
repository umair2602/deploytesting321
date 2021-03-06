import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../appStyles/appStyles.module.css";
import { ErrorMssg, StatesUS } from "../../components/appTypes/appType";
import { errorHandling } from "../../components/formFuncs/errorFuncs";
import { AppMssgList, ErrorList } from "../../components/formFuncs/formFuncs";
import {
  createAppMssgList,
  getFormBorderStyle,
} from "../../components/formFuncs/miscFuncs";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AnyARecord } from "dns";
import GraphResolvers from "../../lib/apollo/apiGraphStrings/index";

const Registration = (props: {}) => {
  const [stateList, setStateList] = useState<StatesUS[]>([]);
  const [notLegal, toggleLegal] = useState(true);
  const [formErrors, setFormErrors] = useState<ErrorMssg[]>([]);
  const [formValidation, setFormValidation] = useState<HTMLFormElement>();
  const router = useRouter();
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const getYear = () => {
    let yearArray = [];
    for (let i = 0; i < 60; i++) {
      yearArray.push(2021 - i);
    }
    return yearArray;
  };

  const [createUser, { loading, error }] = useMutation(
    GraphResolvers.mutations.CREATE_USER
  );
  const { data } = useQuery(GraphResolvers.queries.GET_STATES_US);

  useEffect(() => {
    if (data) {
      setStateList(data.statesUS);
    }
  }, [data]);

  const onSignupSubmit = async (e: any) => {
    e.preventDefault();
    let { formObj, errors } = errorHandling();
    const formObjFormatted = getFormBorderStyle(formObj);
    let appMssgs: string;

    if (errors.length > 0) {
      setFormErrors(errors);
      setFormValidation(formObjFormatted);
      return;
    }

    try {
      const user = await createUser({
        variables: { formInputs: JSON.stringify(formObj) },
      });
      appMssgs = createAppMssgList([
        { message: "Successfully Registered.  Please Log In.", msgType: 1 },
      ]);
      user &&
        router.push(
          {
            pathname: "/Login",
            query: { appMssgs },
          },
          "/Login"
        );
    } catch (err: any) {
      const appMssgs = createAppMssgList([
        { message: err.message, msgType: 0 },
      ]);
      setFormErrors([{ message: err.message }]);
    }
  };

  const userAgreementError = formErrors.some((item) =>
    item.message.includes("User Agreement")
  );

  return (
    <Box
      minH="100vh"
      bg="gray.200"
      // bg="gray.200"
    >
      <Flex align="center" justify="center" minH="100vh">
        <Box
          px={{ base: 6, sm: 14 }}
          pb="16"
          pt="6"
          bgGradient="linear(to-br, white, orange.50)"
          borderRadius="lg"
          boxShadow="lg"
        >
          <Flex justify="center">
            <Image
              src="https://res.cloudinary.com/rahmad12/image/upload/v1624921500/PoldIt/App_Imgs/PoldIt_logo_only_agkhlf.png"
              w="140px"
              cursor="pointer"
            />
          </Flex>
          <form onSubmit={onSignupSubmit}>
            {/* {formErrors.length > 0 && (
              <div className="alert alert-danger">
                {formErrors.map((msg, index) => (
                  <label key={index}>{msg.message}</label>
                ))}
                {userAgreementError && (
                  <label>
                    Please review the User Agreement and click the check box to
                    confirm
                  </label>
                )}
              </div>
            )} */}
            <Stack spacing="6" direction={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel htmlFor="firstName" color="gray.600">
                  First Name
                </FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="lastName" color="gray.600">
                  Last Name
                </FormLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
            </Stack>
            <Stack spacing="6" direction={{ base: "column", md: "row" }} mt="6">
              <FormControl>
                <FormLabel htmlFor="email" color="gray.600">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="username" color="gray.600">
                  Username
                </FormLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
            </Stack>
            <Stack spacing="6" direction={{ base: "column", md: "row" }} mt="6">
              <FormControl>
                <FormLabel htmlFor="password" color="gray.600">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password2" color="gray.600">
                  Retype Password
                </FormLabel>
                <Input
                  id="password2"
                  name="password2"
                  type="password"
                  placeholder="Password"
                  minW={{ base: "100px", sm: "320px" }}
                  isRequired
                />
              </FormControl>
            </Stack>
            {/* <Box mt="3" ml="1">
              <Text color="gray.700">Birthday</Text>
            </Box>
            <Stack spacing="6" direction={{ base: "column", md: "row" }} mt="2">
              <Select name="day" isRequired>
                <option value="" hidden>
                  Day
                </option>
                {Array.from(Array(31).keys()).map((x) => (
                  <option value={x + 1} key={x}>
                    {x + 1}
                  </option>
                ))}
              </Select>
              <Select name="month" isRequired>
                <option value="" hidden>
                  Month
                </option>
                {month.map((x) => (
                  <option value={x} key={x}>
                    {x}
                  </option>
                ))}
              </Select>
              <Select name="year" isRequired>
                <option value="" hidden>
                  Year
                </option>
                {getYear().map((x) => (
                  <option value={x} key={x}>
                    {x}
                  </option>
                ))}
              </Select>
            </Stack> */}
            <Box mt="6">
              <Checkbox color="gray.600" name="agreement" required>
                I agree to the terms & conditions of the{" "}
                <a href="/Registration/UserAgmt"> User Agreement</a>
              </Checkbox>
            </Box>
            <Box mt="5">
              <Button
                w="100%"
                _focus={{ outline: "none" }}
                borderRadius="md"
                color="white"
                //bgGradient="linear(to-l, poldit.100 , orange.300  )"
                bg="poldit.100"
                _hover={{ bg: "orange.300" }}
                _active={{
                  bg: "poldit.100",
                }}
                type="submit"
              >
                Register
              </Button>
            </Box>
          </form>
          <Box mt="3">
            <Text fontSize="sm" color="gray.500">
              Already have an account?{" "}
              <Text
                as="span"
                color="blue.400"
                cursor="pointer"
                onClick={() => router.push("/Login")}
              >
                Login here.
              </Text>
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Registration;
