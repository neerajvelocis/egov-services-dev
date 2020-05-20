import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import FireNocIcon from "../../../../ui-atoms-local/Icons/FireNocIcon";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData, clearlocalstorageAppDetails } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { pbkdf2 } from "crypto";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
let role_name=JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "OPMS",
    labelKey: "ACTION_TEST_BOOKING"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];

if(role_name === 'CITIZEN'){
  const cardlist = [
    {
      label: {
        labelKey: "Apply a Permission for Advertisement",
        labelName: "Apply a Permission for Advertisement"
      },
      icon: <i 
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon">
     picture_in_picture 
      </i>,
      route: "advertisementApply"
      
    },
    {
      label: {
        labelKey: "My Application",
        labelName: "My Application"
      },
      icon: <MyApplicationIcon />,
      route: "advertisementnoc-my-applications"
    },
   
  
  ];
  cardItems = cardlist;
}


const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "advertisementLanding",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('ADVERTISEMENTNOC');
    getRequiredDocData(action, state, dispatch).then(() => {
      let documents = get(
        state,
        "screenConfiguration.preparedFinalObject.searchScreenMdmsData.FireNoc.Documents",
        []
      );
      set(
        action,
        "screenConfig.components.adhocDialog.children.popup",
        getRequiredDocuments(documents)
      );
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-noc",
          componentPath: "HowItWorks"
        }
      }
    },
    // cityPickerDialog: {
    //   componentPath: "Dialog",
    //   props: {
    //     open: false,
    //     maxWidth: "md"
    //   },
    //   children: {
    //     dialogContent: {
    //       componentPath: "DialogContent",
    //       props: {
    //         style: { minHeight: "180px", minWidth: "365px" }
    //       },
    //       children: {
    //         popup: cityPicker
    //       }
    //     }
    //   }
    // }
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-noc",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "advertisementLanding"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
