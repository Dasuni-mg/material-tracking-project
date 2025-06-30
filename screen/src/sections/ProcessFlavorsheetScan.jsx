import { Button, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import VariantBox from "../components/VariantBox";
import { ErrorIcon } from "../Icons";
import DataPanel from "../panels/DataPanel";
import TitlePanel from "../panels/TitlePanel";

function useHistoryState() {
  const { state } = useLocation();
  return state;
}

function ProcessFlavorsheetScan(props) {
  const history = useHistory();
  // const { item_code, created_ts } = useHistoryState();
  const { item_code, created_ts } = {
    item_code: "C123",
    created_ts: Date.now(),
  };

  // const socket = useContext(WebSocketContext);

  const [selectedFlavor, updateSelectedFlavor] = useState(null);
  const [scannedRecord, updateScannedRecord] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = () => {
    try {
      // const selectedFlavor = await fetchResource(
      //   `/app/flavorsheet?item_code=${item_code}&created_ts=${created_ts}`
      // );
      // updateSelectedFlavor(selectedFlavor);

      updateSelectedFlavor({
        item_code: "C1",
        created_ts: 12354324321,
        flavorsheet_no: "Garden A",
        no_of_batches: 5,
        blendsheet: [{ blendsheet_code: "B001", weight: 15 }],
        record_list: [
          {
            barcode: "B001",
            store_location: "Garden 15",
            received_ts: 1246,
            gross_weight: 5,
            bag_weight: 6,
          },
        ],
      });

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
          // updateScannedRecord({ status: "busy" });

          // const [table, barcode] = data.split(":");
          // fetch(`/app/scan?table_name=${table}&barcode=${barcode}`)
          //   .then((res) => res.json())
          //   .then((data) =>
          //     selectedFlavor.blendsheet
          //       .map((item) => item.blendsheet_code)
          //       .includes(data.item_code)
          //       ? {
          //           ...data,
          //           required: Math.min(
          //             selectedFlavor.blendsheet.find(
          //               (item) => item.blendsheet_code === data.item_code
          //             ).weight /
          //               selectedFlavor.no_of_batches -
          //               (updatedRecords[data.item_code] || 0),
          //             1
          //           ),
          //         }
          //       : null
          //   )
          //   .then((data) =>
          //     ["ACCEPTED", "IN_PROCESS"].includes(data.status) &&
          //     data.required * (data.gross_weight - data.bag_weight) <=
          //       data.remaining
          //       ? updateScannedRecord({ status: "success", data })
          //       : updateScannedRecord({ status: "error" })
          //   )
          //   .catch(() => updateScannedRecord({ status: "error" }));
          updateScannedRecord({
            status: "success",
            data: {
              item_code: "I001",
              created_ts: 12354324321,
              invoice_no: 12354,
              garden: "Garden A",
              garden_sub: "Garden sub",
              no_of_bags: 5,
              broker: "b112",
              barcode: crypto.randomUUID(),
              required: 1,
            },
          });
        });
      }
    }
  });

  const [updatedRecords, setUpdatedRecords] = useState(() => {
    let flavorsheetList = localStorage.getItem("flavorsheet");
    flavorsheetList = flavorsheetList ? JSON.parse(flavorsheetList) : [];
    return (
      flavorsheetList.find(
        (flavorsheet) =>
          flavorsheet.item_code === item_code &&
          flavorsheet.created_ts === created_ts
      )?.updatedRecords || {}
    );
  });

  useEffect(() => {
    let flavorsheetList = localStorage.getItem("flavorsheet");
    flavorsheetList = flavorsheetList ? JSON.parse(flavorsheetList) : [];
    const flavorsheetIndex = flavorsheetList.findIndex(
      (flavorsheet) =>
        flavorsheet.item_code === item_code &&
        flavorsheet.created_ts === created_ts
    );

    if (flavorsheetIndex !== -1) flavorsheetList?.splice(flavorsheetList, 1);

    localStorage.setItem(
      "flavorsheet",
      JSON.stringify(
        flavorsheetList.concat([
          {
            item_code,
            created_ts,
            updatedRecords,
          },
        ])
      )
    );
  }, [updatedRecords]);

  const onUpdateRecordClick = () => {
    // fetch("/app/blendsheet", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     barcode: scannedRecord.data.barcode,
    //     reduced_by:
    //       (scannedRecord.data.gross_weight - scannedRecord.data.bag_weight) *
    //       scannedRecord.data.required,
    //   }),
    // }).then(() => {
    //   setUpdatedRecords({
    //     ...updatedRecords,
    //     [scannedRecord.data.item_code]:
    //       (updatedRecords[scannedRecord.data.item_code] || 0) +
    //       scannedRecord.data.required,
    //   });
    //   updateScannedRecord(null);
    // });
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onStartClick = () => [
    // fetch("/app/flavorsheet", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     item_code,
    //     created_ts,
    //     active: true,
    //   }),
    // }).then(onBackClick),
  ];

  return (
    <Flex h="100%" flexDir="column">
      <Flex flex={1}>
        {resources === null || resources.status === "busy" ? (
          <Spinner m="auto" size="xl" />
        ) : resources.status === "ready" ? (
          <Fragment>
            <DataPanel
              title={`${selectedFlavor.item_code} (${selectedFlavor.flavorsheet_no})`}
              summary={`Created At: ${new Date(
                parseInt(selectedFlavor.created_ts)
              ).toISOString()}`}
              disabled={selectedFlavor.blendsheet.reduce(
                (isDisabled, item) =>
                  isDisabled ||
                  (updatedRecords[item.blendsheet_code] || 0) <
                    item.weight / selectedFlavor.no_of_batches,
                false
              )}
              enableText="Start Process"
              disableText="Batch Not Ready"
              onButtonClick={onStartClick}
              table={selectedFlavor.blendsheet.reduce((table, item) => {
                if (!table.length)
                  table.push([
                    { label: "Blendsheet Code", numeric: false },
                    { label: "Bags Checked", numeric: true },
                  ]);
                table.push([
                  item.blendsheet_code,
                  `${updatedRecords[item.blendsheet_code] || 0} / ${
                    item.weight / selectedFlavor.no_of_batches
                  }`,
                ]);
                return table;
              }, [])}
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
      <TitlePanel
        title=" Flavorsheet - Process Batch"
        backButtonLabel="Go back to flavorsheet selection"
        onBackButtonClick={onBackClick}
      />
    </Flex>
  );
}

export default ProcessFlavorsheetScan;
