import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResultsRoadcut } from "./searchResource/searchResults";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { getGridDataRoadcut } from "./searchResource/citizenSearchFunctions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "ROAD CUT NOC",
  labelKey: "ROADCUT_COMMON_NOC"
});


const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "roadcut-search",
  beforeInitScreen: (action, state, dispatch) => {
    getGridDataRoadcut(action, state, dispatch);


    const tenantId = getTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ROADCUTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "ROADCUTNOC" });
    const { states } = data || [];
    if (states && states.length > 0) {
      const status = states.map((item, index) => {
        return {
          code: item.state
        };
      });
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.searchScreen.status",
          status.filter(item => item.code != null)
        )
      );
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "roadcut-search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
        },
        breakAfterSearch: getBreak(),
        searchResultsRoadcut
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "roadcut-search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default NOCSearchAndResult;
