import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  BackIcon,
  EmptyIcon,
  ErrorIcon,
  DeleteIcon,
  NotEmptyIcon,
} from "../Icons";
import VariantBox from "../components/VariantBox";

function AcceptHerblineWeight() {
  //const socket = useContext(WebSocketContext);

  const [herblineList, updateHerblineList] = useState(null);
  const [locationList, updateLocationList] = useState(null);
  const [loadCellValue, updateLoadCellValue] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = async() => {
    try {
      

   
       const herblineList = await  fetch(
        `https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/herbline?item_code=${item_code}&created_ts=${created_ts}`
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateHerblineList(herblineList);
      
    

      const locationList = await fetch(
        "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/location?herb_section=0"
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateLocationList(locationList);


      updateResources({ status: "ready" });
    } catch (e) {
      updateResources({ status: "error", message: e.message });
    }
  };

  const [locked, setLocked] = useState(false);
  const onLockScaleClick = () => {
    setLocked(!locked);
  };

  useEffect(() => {
    if (resources === null) {
      updateResources({ status: "busy" });
       setupResources();
       return;
    }
    if (resources.status === "ready") {
      if (!locked) {
        return app.serialRx("loadcell", (_, data) => {
          updateLoadCellValue(data);
        });
      }
    }
  });

  const [herblineIndex, setHerblineIndex] = useState("");
  const [herblineError, setHerblineError] = useState(null);
  const onHerblineChange = (event) => {
    if (event.target.value !== "") setHerblineError(null);
    setHerblineIndex(event.target.value);
  };

  const [locationIndex, setLocationIndex] = useState("");
  const [locationError, setLocationError] = useState(null);
  const onLocationChange = (event) => {
    if (event.target.value !== "") setLocationError(null);
    setLocationIndex(event.target.value);
  };

  const [referenceValue, setReferenceValue] = useState("");
  const [referenceError, setReferenceError] = useState(null);
  const onReferenceChange = (event) => {
    if (event.target.value !== referenceValue) setReferenceError(null);
    setReferenceValue(event.target.value);
  };

  const [addedRecords, updateAddedRecords] = useState([]);

  const onAddRecordClick = () => {
    let errorOccured = false;
    if (herblineIndex === "") {
      errorOccured = true;
      setHerblineError("Please select a herb code.");
    }
    if (locationIndex === "") {
      errorOccured = true;
      setLocationError("Please select a store location.");
    }
    if (referenceValue === "") {
      errorOccured = true;
      setReferenceError("Please enter a reference.");
    }
    if (errorOccured) return;

   
    fetch(
      "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/herbline/record",
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_code: herblineList[herblineIndex].item_code,
        gross_weight: loadCellValue.reading,
        store_location: locationList[locationIndex].store_location,
        reference: referenceValue,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(
          res.status === 500 ? "Internal Server Error" : res.text()
        );
      })
      .then(({ created_ts, barcode }) => {
        updateAddedRecords(
          addedRecords.concat([
            {
              barcode,
              received_ts: Number(created_ts),
              store_location: locationList[locationIndex].store_location,
              gross_weight: loadCellValue.reading,
              reference: referenceValue,
            },
          ])
        );

        app.setialTx("printer", {
          "Herbline Code": herblineList[herblineIndex].item_code,
          "Scanned At": new Date(Number(created_ts)).toISOString(),
          Location: locationList[locationIndex].store_location,
          "Gross Weight": loadCellValue.reading,
          Reference: referenceValue,
          barcode: `herbline_record:${barcode}`,
        });
      })
      .catch((e) => {});
  };

  return (
    <Flex h="100%" flexDir="column">
      <Flex flex={1}>
        {resources === null || resources.status === "busy" ? (
          <Spinner m="auto" size="xl" />
        ) : resources.status === "ready" ? (
          <Fragment>
            {addedRecords.length ? (
              <Box position="relative" w="100%" h="100%" flex={1}>
                <Box
                  position="absolute"
                  top={4}
                  left={4}
                  bottom={4}
                  right={4}
                  overflowY="auto"
                >
                  <Table variant="simple">
                    <Thead position="sticky" top={0}>
                      <Tr>
                        <Th>Bag ID</Th>
                        <Th>Created At</Th>
                        <Th isNumeric>Weight (KG)</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {addedRecords.map((record) => (
                        <Tr key={record.barcode}>
                          <Td>
                            <VariantBox>
                              <Text fontSize="md">{record.barcode}</Text>
                            </VariantBox>
                            <VariantBox variant="quiet">
                              <Text fontSize="xs">{record.store_location}</Text>
                            </VariantBox>
                          </Td>
                          <Td>{new Date(record.received_ts).toISOString()}</Td>
                          <Td isNumeric>{record.gross_weight}</Td>
                          <Td>
                            <IconButton
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              icon={<DeleteIcon />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot position="sticky" bottom={0}>
                      <Tr>
                        <Th colSpan={4} isNumeric>
                          <VariantBox variant="default">
                            <NotEmptyIcon w={4} h={4} me={2} />
                            {`${addedRecords.length} bags added`}
                          </VariantBox>
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </Box>
              </Box>
            ) : (
              <VariantBox
                flex={1}
                h="100%"
                p={4}
                textAlign="center"
                variant="quiet"
              >
                <VStack h="100%" spacing={4} justify="center">
                  <EmptyIcon w={20} h={20} />
                  <Heading size="xl" textAlign="center">
                    No bags added
                  </Heading>
                  <Text fontSize="lg" textAlign="center">
                    Start adding bags by selecting "Herbline Code" and clicking
                    "Add Bag" button.
                    <br />
                    Make sure to set "Store Location" and "Reference" before
                    adding bag.
                  </Text>
                </VStack>
              </VariantBox>
            )}
            <Flex
              w="448px"
              p={4}
              borderLeftWidth="1px"
              flexDir="column"
              alignItems="center"
            >
              {loadCellValue === null ? (
                <Spinner mt={20} mb="auto" size="xl" />
              ) : (
                <VariantBox
                  mt={12}
                  mb="auto"
                  textAlign="center"
                  variant={
                    locked
                      ? "danger"
                      : loadCellValue.stable
                      ? "success"
                      : "default"
                  }
                >
                  <Heading size="4xl">
                    {Number.parseFloat(loadCellValue.reading).toFixed(2)}
                  </Heading>
                  <Heading mt={2} size="sm">
                    KG
                    {locked
                      ? " (Locked)"
                      : loadCellValue.stable
                      ? " (Stable)"
                      : ""}
                  </Heading>
                </VariantBox>
              )}
              <FormControl isInvalid={herblineError}>
                <Select
                  mt={2}
                  placeholder="Herb Code"
                  value={herblineIndex}
                  onChange={onHerblineChange}
                >
                  {herblineList.map((herbline, index) => (
                    <option key={index} value={index}>
                      {`${herbline.item_code} - ${herbline.name}`}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{herblineError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={locationError}>
                <Select
                  mt={2}
                  placeholder="Store Location"
                  value={locationIndex}
                  onChange={onLocationChange}
                >
                  {locationList.map((location, index) => (
                    <option key={index} value={index}>
                      {`${location.store_location}`}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{locationError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={referenceError}>
                <InputGroup mt={2}>
                  <Input
                    placeholder="Reference"
                    value={referenceValue}
                    onChange={onReferenceChange}
                  />
                </InputGroup>
                <FormErrorMessage>{referenceError}</FormErrorMessage>
              </FormControl>
              <HStack w="full" mt={2}>
                <Button flex="1" onClick={onAddRecordClick}>
                  Add Bag
                </Button>
                <Button
                  colorScheme="red"
                  flex="1"
                  variant={locked ? "outline" : "solid"}
                  onClick={onLockScaleClick}
                >
                  {locked ? "Unlock Scale" : "Lock Scale"}
                </Button>
              </HStack>
            </Flex>
          </Fragment>
        ) : (
          <VariantBox m="auto" variant="quiet">
            <VStack spacing={4}>
              <ErrorIcon w={20} h={20} />
              <Heading size="xl" textAlign="center">
                Resource initialization failed
              </Heading>
              <Text fontSize="lg" textAlign="center">
                {resources.message}
              </Text>
            </VStack>
          </VariantBox>
        )}
      </Flex>
      <Flex p={4} justify="space-between" align="end" borderTopWidth="1px">
        <Box>
          <Button
            leftIcon={<BackIcon />}
            variant="link"
            size="sm"
            // onClick={onBackClick}
          >
            Go back to main menu
          </Button>
          <Heading mt={2} size="lg">
            Herbs - Add Bag
          </Heading>
          <Text mt={1} fontSize="md">
            {/* {`${item_code} - ${garden_sub} (${garden})`} */}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default AcceptHerblineWeight;
