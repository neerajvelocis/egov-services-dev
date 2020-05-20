import { fetchOPMSCardsData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getOPMSCards } from "../../../../ui-utils/commons";
import get from "lodash/get";

import {
  screenConfiguration,
  
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "NOC_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);





const screenConfig = {
  uiFramework: "material-ui",
  name: "egov-landing",
  beforeInitScreen: (action, state, dispatch) => {
    //fetchOPMSCardsData(action, state, dispatch);
    var temp=fetchOPMSCardsData(action, state, dispatch);
    //alert(temp)
    if(temp)
    {
      //alert(JSON.stringify( get(
      //  state,
      //  //"screenConfiguration.preparedFinalObject.OPMSCardsData"
      //)))
      
    }
    return action;
  },
 
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            applicationName: {
              label: "NOC_COMMON_TABLE_COL_BUILDING_NAME_LABEL",
              jsonPath: "fireNOCDetails.buildings[0].name"
            },
            applicationNumber: {
              label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
              jsonPath: "fireNOCDetails.applicationNumber"
            },
            ownerName: {
              label: "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
              jsonPath: "fireNOCDetails.applicantDetails.owners[0].name"
            },
            moduleNumber: {
              label: "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
              jsonPath: "fireNOCNumber"
            },
            status: {
              label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
              jsonPath: "fireNOCDetails.status"
            },
            moduleName: "FIRENOC",
            statusPrefix: "WF_FIRENOC_"
          }
        }
      }
    }
  }
};


export default screenConfig;
