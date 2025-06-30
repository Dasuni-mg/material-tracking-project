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

function ProcessBlendsheetScan(props) {
  const history = useHistory();
  // const { item_code, created_ts } = useHistoryState();
  const item_code = "C1";
  const created_ts = 12354324321;
  //const socket = useContext(WebSocketContext);

  const [selectedBlend, updateSelectedBlend] = useState(null);
  const [scannedRecord, updateScannedRecord] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = () => {
    try {
      // const selectedBlend = await fetchResource(
      //   `/app/blendsheet?item_code=${item_code}&created_ts=${created_ts}`
      // );
      // updateSelectedBlend(selectedBlend);
      updateSelectedBlend({
        item_code: "C1",
        created_ts: 12354324321,
        flavorsheet_no: "Garden A",
        no_of_batches: 5,
        tealine: [{ tealine_code: "B001", weight: 15 }],
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
        return app.socketRx("scanner", (_, data) => {
          updateScannedRecord({ status: "busy" });

          const [table, barcode] = data.split(":");
          fetch(`/app/scan?table_name=${table}&barcode=${barcode}`)
            .then((res) => res.json())
            .then((data) =>
              selectedBlend.tealine
                .map((item) => item.tealine_code)
                .includes(data.item_code)
                ? {
                    ...data,
                    required: Math.min(
                      selectedBlend.tealine.find(
                        (item) => item.tealine_code === data.item_code
                      ).no_of_bags /
                        selectedBlend.no_of_batches -
                        (updatedRecords[data.item_code] || 0),
                      1
                    ),
                  }
                : null
            )
            .then((data) =>
              ["ACCEPTED", "IN_PROCESS"].includes(data.status) &&
              data.required * (data.gross_weight - data.bag_weight) <=
                data.remaining
                ? updateScannedRecord({ status: "success", data })
                : updateScannedRecord({ status: "error" })
            )
            .catch(() => updateScannedRecord({ status: "error" }));
        });
        // socket.on("scanner:data", scannerCallback);
        // return () => {
        //   socket.off("scanner:data", scannerCallback);
        // };
      }
    }
  });

  const [updatedRecords, setUpdatedRecords] = useState(() => {
    let blendsheetList = localStorage.getItem("blendsheet");
    blendsheetList = blendsheetList ? JSON.parse(blendsheetList) : [];
    return (
      blendsheetList.find(
        (blendsheet) =>
          blendsheet.item_code === item_code &&
          blendsheet.created_ts === created_ts
      )?.updatedRecords || {}
    );
  });

  useEffect(() => {
    let blendsheetList = localStorage.getItem("blendsheet");
    blendsheetList = blendsheetList ? JSON.parse(blendsheetList) : [];
    const blendsheetIndex = blendsheetList.findIndex(
      (blendsheet) =>
        blendsheet.item_code === item_code &&
        blendsheet.created_ts === created_ts
    );

    if (blendsheetIndex !== -1) blendsheetList?.splice(blendsheetList, 1);

    localStorage.setItem(
      "blendsheet",
      JSON.stringify(
        blendsheetList.concat([
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
    // fetch("/app/tealine", {
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
    // fetch("/app/blendsheet", {
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
              title={`${selectedBlend.item_code} (${selectedBlend.blendsheet_no})`}
              summary={`Created At: ${new Date(
                parseInt(selectedBlend.created_ts)
              ).toISOString()}`}
              disabled={selectedBlend.tealine.reduce(
                (isDisabled, item) =>
                  isDisabled ||
                  (updatedRecords[item.tealine_code] || 0) <
                    item.no_of_bags / selectedBlend.no_of_batches,
                false
              )}
              enableText="Start Process"
              disableText="Batch Not Ready"
              onButtonClick={onStartClick}
              table={selectedBlend.tealine.reduce(
                (table, item) => {
                  table.push([
                    item.tealine_code,
                    `${updatedRecords[item.tealine_code] || 0} / ${
                      item.no_of_bags / selectedBlend.no_of_batches
                    }`,
                  ]);
                  return table;
                },
                [
                  [
                    { label: "Tealine Code", numeric: false },
                    { label: "Bags Checked", numeric: true },
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
      <TitlePanel
        title="Blendsheet - Process Batch"
        backButtonLabel="Go back to blendsheet selection"
        onBackButtonClick={onBackClick}
      />
    </Flex>
  );
}

export default ProcessBlendsheetScan;
