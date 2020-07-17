import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData, clearlocalstorageAppDetails } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getAccessToken,
  getTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
let role_name=JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Services",
    labelKey: "ACTION_TEST_SERVICES"
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
        labelKey: "BK_APPLY",
        labelName: "Apply for Booking"
      },
      icon: <i 
      viewBox="0 -8 35 42"
      color="primary"
      font-size="30px"
      class="material-icons module-page-icon">
      add_business
      </i>,
      route: "applyservices"
      
    },
    {
      label: {
        labelKey: "My Applications",
        labelName: "BK_MY_BOOKINGS"
      },
      icon : <i 
      viewBox="0 -8 35 42"
      color="primary"
      font-size="30px"
      class="material-icons module-page-icon">
      description
      </i>,
      // icon: <MyApplicationIcon />,
      route: "my-applications"
    },
   
  
  ];
  cardItems = cardlist;
}


const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "openSpaceBooking",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('OPB');
    
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
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-services",
        //   componentPath: "HowItWorks"
        // }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "openSpaceBooking"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
