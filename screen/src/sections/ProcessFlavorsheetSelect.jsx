import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SelectPanel, { SelectPanelError } from "../panels/SelectPanel";
//import { fetchResource } from "../util/http";

function ProcessFlavorsheetSelect() {
  const history = useHistory();

  const [flavorList, updateFlavorList] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = async () => {
    try {
      // const flavorList = await fetchResource(`/app/flavorsheet`);
      // if (flavorList.active)
      //   throw new Error(
      //     "Cannot select another flavorsheet while a batch is already in process."
      //   );
      // updateFlavorList(flavorList.inventory);

      const flavorList = await fetch(
        "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/flavorsheet"
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateFlavorList(flavorsheet);


      updateResources({ status: "ready" });
    } catch (e) {
      updateResources({
        status: "error",
        error: new SelectPanelError("Batch Process Unavailable", e.message),
      });
    }
  };

  useEffect(() => {
    if (resources === null) {
      updateResources({ status: "busy" });
      setupResources();
    }
  });

  const onSelectPanelStartClick = ({ item_code, created_ts }) => {
    history.push(`/flavorsheet`, { item_code, created_ts });
  };

  return (
    <SelectPanel
      title="Flavorsheet - Process Batch"
      subtitle="Select a flavorsheet, then click start to process."
      selectList={flavorList}
      selectItem={(item) => `${item.item_code} (${item.flavorsheet_no})`}
      selectHint="Choose a flavorsheet..."
      selectErrorHint="Please select a flavorsheet."
      panelState={resources}
      onStartClick={onSelectPanelStartClick}
    />
  );
}

export default ProcessFlavorsheetSelect;
