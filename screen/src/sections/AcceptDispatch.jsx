import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { ErrorIcon } from "../Icons";
import VariantBox from "../components/VariantBox";
import TitlePanel from "../panels/TitlePanel";
import DataPanel from "../panels/DataPanel";

function AcceptDispatch(props) {
  const history = useHistory();

  //const socket = useContext(WebSocketContext);

  const [scannedRecord, updateScannedRecord] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = () => {
    try {
      updateResources({ status: "ready" });
    } catch (e) {
      updateResources({ status: "error", message: e.message });
    }
  };

  useEffect(() => {
    if (resources === null) {
      updateResources({ status: "busy" });
      return setupResources();
    }
    if (resources.status === "ready") {
      if (
        !scannedRecord ||
        scannedRecord.status !== "success" ||
        scannedRecord.data.required === 0
      ) {
        return app.serialRx("scanner", (_, data) => {
          updateScannedRecord({ status: "busy" });

          const [table, barcode] = data.split(":");
          fetch(`/app/scan?table_name=${table}&barcode=${barcode}`)
            .then((res) => res.json())

            .then((data) =>
              ["ACCEPTED"].includes(data.status)
                ? updateScannedRecord({
                    status: "success",
                    data: { ...data, table },
                  })
                : updateScannedRecord({ status: "error" })
            )
            .catch(() => updateScannedRecord({ status: "error" }));
        });
      }
    }
  });

  const [updatedRecords, setUpdatedRecords] = useState({});

  const onUpdateRecordClick = () => {
    setUpdatedRecords({
      ...updatedRecords,
      [scannedRecord.data.item_code]: scannedRecord.data.table,
    });
    updateScannedRecord(null);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onStartClick = () => {
    // Promise.all(
    //   Object.keys(updatedRecords).map((key) =>
    //     fetch(`/app/${updatedRecords[key]}`, {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //     })
    //   )
    // );
  };

  return (
    <Flex h="100%" flexDir="column">
      <Flex flex={1}>
        {resources === null || resources.status === "busy" ? (
          <Spinner m="auto" size="xl" />
        ) : resources.status === "ready" ? (
          <Fragment>
            <DataPanel
              title=""
              summary=""
              disabled={false}
              enableText="Start Process"
              disableText="Batch Not Ready"
              onButtonClick={onStartClick}
              table={Object.keys(updatedRecords).reduce(
                (table, key) => {
                  table.push([key, updatedRecords[key]]);
                  return table;
                },
                [
                  [
                    { label: "Item Code", numeric: false },
                    { label: "Item Type", numeric: false },
                  ],
                ]
              )}
            />
            <Flex
              w="448px"
              p={4}
              borderLeftWidth="1px"
              flexDir="column"
              alignItems="center"
            >
              {scannedRecord === null ? (
                <Heading my="auto" size="md">
                  Scan barcode to add bag.
                </Heading>
              ) : scannedRecord.status === "success" ? (
                <VariantBox textAlign="center" my="auto" variant="success">
                  <Heading size="md">{scannedRecord.data.item_code}</Heading>
                  <Text>{`${scannedRecord.data.garden_sub} (${scannedRecord.data.garden})`}</Text>
                  {scannedRecord.data.required > 0 ? (
                    <Fragment>
                      <Heading mt={4}>{scannedRecord.data.required}</Heading>
                      <Text>will be added.</Text>
                      <Button mt={2} onClick={onUpdateRecordClick}>
                        Add Bag
                      </Button>
                    </Fragment>
                  ) : (
                    <Text>
                      Required amount fulfilled. Nothing will be added.
                    </Text>
                  )}
                </VariantBox>
              ) : (
                <VariantBox textAlign="center" my="auto" variant="danger">
                  <Heading size="md">
                    Cannot add bag, please scan again.
                  </Heading>
                </VariantBox>
              )}
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
      <TitlePanel title="Sendoff Section" />
    </Flex>
  );
}

export default AcceptDispatch;
