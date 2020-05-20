import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import {NOCReport2} from "./searchResource/MISSummaryReportApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { pendingApprovals } from "./searchResource/pendingApprovals";
  import { searchResultsReports4 } from "./searchResource/searchResults";
  import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
  import {
    getOPMSTenantId,
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
  import { getUpdatePriceBook,getrepotforproccessingTime,getSectordata} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Application Proccessing Time Report",
    labelKey: "NOC_REVENUE_PROCCESSING_TIME_WISE"
  });
  
  const pageResetAndChange = (state, dispatch) => {
    dispatch(
      prepareFinalObject("FireNOCs", [{ "fireNOCDetails.fireNOCType": "NEW" }])
    );
    // dispatch(setRoute("/tradelicence/apply"));al
  };
  //alert('in update rate')
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "reportForProcessingTime",
    beforeInitScreen: (action, state, dispatch) => {
        
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );

  
    getrepotforproccessingTime(action, state, dispatch);
      
      // const tenantId = getOPMSTenantId();
      // const BSqueryObject = [
      //   { key: "tenantId", value: tenantId },
      //   { key: "businessServices", value: "FIRENOC" }
      // ];
      // setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
      // const businessServiceData = JSON.parse(
      //   localStorageGet("businessServiceData")
      // );
      // const data = find(businessServiceData, { businessService: "FIRENOC" });
      // const { states } = data || [];
      // if (states && states.length > 0) {
      //   const status = states.map((item, index) => {
      //     return {
      //       code: item.state
      //     };
      //   });
      //   dispatch(
      //     prepareFinalObject(
      //       "applyScreenMdmsData.searchScreen.status",
      //       status.filter(item => item.code != null)
      //     )
      //   );
      // }
      // getRequiredDocData(action, state, dispatch).then(() => {
      //   let documents = get(
      //     state,
      //     "screenConfiguration.preparedFinalObject.searchScreenMdmsData.FireNoc.Documents",
      //     []
      //   );
      //   set(
      //     action,
      //     "screenConfig.components.adhocDialog.children.popup",
      //     getRequiredDocuments(documents)
      //   );
      // });
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "reportForProcessingTime"
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 6
            },
            ...header
          },
        
          searchResultsReports4
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-noc",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "reportForProcessingTime"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default NOCSearchAndResult;
  