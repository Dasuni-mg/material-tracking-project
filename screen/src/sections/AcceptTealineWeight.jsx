import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
import TitlePanel from "../panels/TitlePanel";
import DataPanel from "../panels/DataPanel";

function useHistoryState() {
  const { state } = useLocation();
  return state;
}

function AcceptTealineWeight() {
  const history = useHistory();
  const { item_code, created_ts } = useHistoryState();

  const [selectedTealine, updateSelectedTealine] = useState(null);
  const [locationList, updateLocationList] = useState(null);
  const [loadCellValue, updateLoadCellValue] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = async () => {
    try {
      const selectedTealine = await fetch(
        `https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/tealine?item_code=${item_code}&created_ts=${created_ts}`
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateSelectedTealine(selectedTealine);

      

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

  const [locationIndex, setLocationIndex] = useState("");
  const [locationError, setLocationError] = useState(null);
  const onLocationChange = (event) => {
    if (event.target.value !== "") setLocationError(null);
    setLocationIndex(event.target.value);
  };

  const [tareWeightValue, setTareWeightValue] = useState("");
  const [tareWeightError, setTareWeightError] = useState(null);
  const onTareWeightChange = (event) => {
    if (event.target.value !== tareWeightValue) setTareWeightError(null);
    setTareWeightValue(event.target.value);
  };

  const onAddRecordClick = () => {
    let errorOccured = false;
    if (locationIndex === "") {
      errorOccured = true;
      setLocationError("Please select a store location.");
    }
    if (tareWeightValue === "" || Number.isNaN(Number(tareWeightValue))) {
      errorOccured = true;
      setTareWeightError("Please enter a numeric value.");
    }
    if (errorOccured) return;

    fetch(
      "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/tealine/record",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_code,
          created_ts,
          store_location: locationList[locationIndex].store_location,
          gross_weight: loadCellValue.reading,
          bag_weight: tareWeightValue,
        }),
      }
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(
          res.status === 500 ? "Internal Server Error" : res.text()
        );
      })
      .then(({ received_ts, barcode }) => {
        const { record_list, ...tealine } = selectedTealine;
        updateSelectedTealine({
          ...tealine,
          record_list: record_list.concat([
            {
              barcode,
              received_ts: Number(received_ts),
              store_location: locationList[locationIndex].store_location,
              gross_weight: loadCellValue.reading,
              bag_weight: tareWeightValue,
            },
          ]),
        });
        app.serialTx("printer", {
          "Invoice No": selectedTealine.invoice_no,
          Garden: `${selectedTealine.garden} - ${selectedTealine.garden_sub}`,
          "Tealine No": item_code,
          "Scanned At": new Date(Number(received_ts)).toISOString(),
          Location: locationList[locationIndex].store_location,
          "Gross Weight": loadCellValue.reading,
          "Bag Weight": tareWeightValue,
          "Net Weight": loadCellValue.reading - tareWeightValue,
          "Bag No": `${record_list.length + 1} / ${selectedTealine.no_of_bags}`,
          barcode: `tealine_record:${barcode}`,
        });
      })
      .catch((e) => {});
  };

  const onBackClick = () => {
    history.goBack();
  };

  return (
    <Flex h="100%" flexDir="column">
      <Flex flex={1}>
        {resources === null || resources.status === "busy" ? (
          <Spinner m="auto" size="xl" />
        ) : resources.status === "ready" ? (
          <Fragment>
            <DataPanel
              title={`${selectedTealine.garden} (${selectedTealine.broker})`}
              summary={`Item Code: ${
                selectedTealine.item_code
              }\nCreated At: ${new Date(
                parseInt(selectedTealine.created_ts)
              ).toISOString()}`}
              hideButton
              table={selectedTealine.record_list.reduce(
                (table, item) => {
                  table.push([
                    <Fragment>
                      <VariantBox>
                        <Text fontSize="md">{item.barcode}</Text>
                      </VariantBox>
                      <VariantBox variant="quiet">
                        <Text fontSize="xs">{item.store_location}</Text>
                      </VariantBox>
                    </Fragment>,
                    new Date(item.received_ts).toISOString(),
                    `${item.gross_weight} (${item.bag_weight})`,
                  ]);
                  return table;
                },
                [
                  [
                    { label: "Bag ID", numeric: false },
                    { label: "Created At", numeric: false },
                    { label: "Weight (KG)", numeric: true },
                  ],
                ]
              )}
              emptyState={
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
                      0 / {selectedTealine.no_of_bags} bags added
                    </Heading>
                    <Text fontSize="lg" textAlign="center">
                      Start adding bags by clicking "Add Bag" button.
                      <br />
                      Make sure to set "Store Location" and "Tare Weight" before
                      adding bag.
                    </Text>
                  </VStack>
                </VariantBox>
              }
            />
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
              <FormControl isInvalid={tareWeightError}>
                <InputGroup mt={2}>
                  <Input
                    placeholder="Tare Weight"
                    value={tareWeightValue}
                    onChange={onTareWeightChange}
                  />
                  <InputRightAddon children="KG" />
                </InputGroup>
                <FormErrorMessage>{tareWeightError}</FormErrorMessage>
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
      <TitlePanel
        title="Tealine - Add Bag"
        backButtonLabel="Go back to tealine selection"
        onBackButtonClick={onBackClick}
      />
    </Flex>
  );
}

export default AcceptTealineWeight;
