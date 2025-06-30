import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SelectPanel, { SelectPanelError } from "../panels/SelectPanel";

function AcceptTealineSelect() {
  const history = useHistory();

  const [tealineList, updateTealineList] = useState(null);
  const [resources, updateResources] = useState(null);

  const setupResources = async () => {
    try {
      const tealineList = await fetch(
        "https://kbqaafvx42.execute-api.us-east-2.amazonaws.com/main/app/tealine"
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 500 ? "Internal Server Error" : await res.text()
          );
        return res.headers.get("content-type").startsWith("application/json")
          ? await res.json()
          : await res.text();
      });
      updateTealineList(tealineList);

      updateResources({ status: "ready" });
    } catch (e) {
      updateResources({
        status: "error",
        error: new SelectPanelError("Bag Acceptance Failed", e.message),
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
    history.push("/tealine", { item_code, created_ts });
  };

  return (
    <SelectPanel
      title="Tealine - Accept Bags"
      subtitle="Select a tealine, then click start to add bags."
      selectList={tealineList}
      selectItem={(item) =>
        `${item.item_code} - ${item.garden} (${item.broker})`
      }
      selectHint="Choose a tealine..."
      selectErrorHint="Please select a tealine."
      panelState={resources}
      onStartClick={onSelectPanelStartClick}
    />
  );
}

export default AcceptTealineSelect;
