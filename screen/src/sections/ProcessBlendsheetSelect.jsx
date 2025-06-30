import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SelectPanel, { SelectPanelError } from "../panels/SelectPanel";

function ProcessBlendsheetSelect() {
  const history = useHistory();

  const [blendList, updateBlendList] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = async () => {
    try {
      

      const blendList = await fetch(
        "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/blendsheet"
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateBlendList(blendList);

     
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
    history.push(`/blendsheet`, { item_code, created_ts });
  };

  return (
    <SelectPanel
      title="Blendsheet - Process Batch"
      subtitle="Select a blendsheet, then click start to process."
      selectList={blendList}
      selectItem={(item) => `${item.item_code} (${item.blendsheet_no})`}
      selectHint="Choose a blendsheet..."
      selectErrorHint="Please select a blendsheet."
      panelState={resources}
      onStartClick={onSelectPanelStartClick}
    />
  );
}

export default ProcessBlendsheetSelect;
