import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getRequiredDocData } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import {
  getUserInfo,
  setOPMSTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
let role_name = JSON.parse(getUserInfo()).roles[0].code;
const header = getCommonHeader(
  {
    labelName: "SERVICES",
    labelKey: "ACTION_TEST_SERVICES",
  },
  {
    classes: {
      root: "common-header-cont",
    },
  }
);
let cardItems = [];
if (role_name === "CITIZEN") {
  const cardlist = [
    {
      label: {
        labelKey: "CS_HOME_OPEN_SPACE_MCC",
        labelName: "Open Space MCC",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          picture_in_picture
        </i>
      ),
      route: "openSpaceBooking",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
    {
      label: {
        labelKey: "CS_HOME_COMMUNITY_CENTER",
        labelName: "Community Center",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon"
        >
          pets
        </i>
      ),
      route: "communityCenterBooking",
    },
    // {
    //   label: {
    //     labelKey: "CS_HOME_GROUND_BOOKING",
    //     labelName: "Ground Booking"
    //   },
    //   icon: <i
    //     viewBox="0 -8 35 42"
    //     color="primary"
    //     class="material-icons module-page-icon">
    //     restaurant
    //   </i>,
    //   route: "groundBooking"
    //   // {
    //   //   screenKey: "citizenMainLanding",
    //   //   jsonPath: "components.adhocDialog"
    //   // }
    // },

    // {
    //   label: {
    //     labelKey: "CS_HOME_STORE_BUILDING",
    //     labelName: "Store Building"
    //   },
    //   icon: <i
    //     viewBox="0 -8 35 42"
    //     color="primary"
    //     class="material-icons module-page-icon">
    //     report_problem
    //   </i>,
    //   route: "storeBuildingBooking"
    //   // {
    //   //   screenKey: "home",
    //   //   jsonPath: "components.adhocDialog"
    //   // }
    // },
    {
      label: {
        labelKey: "CS_HOME_WATER_TANKER",
        labelName: "Water Tanker Booking",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          report_problem
        </i>
      ),
      route: "waterTankerBooking",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
  ];
  cardItems = cardlist;
} else if (role_name === "SI" || role_name === "MOH") {
  const cardlist = [
    {
      label: {
        labelKey: "Permission to Keep Pet Dog",
        labelName: "Permission to Keep Pet Dog",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon"
        >
          pets
        </i>
      ),
      route: "search",
    },
    {
      label: {
        labelKey: "Permission to Sell Meat",
        labelName: "Permission to Sell Meat",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          restaurant
        </i>
      ),
      route: "sellmeat-search",
    },
  ];
  cardItems = cardlist;
} else if (
  role_name === "CE" ||
  role_name === "JE" ||
  role_name === "SDO" ||
  role_name === "EE" ||
  role_name === "SE"
) {
  const cardlist = [
    {
      label: {
        labelKey: "Permission for Road Cut",
        labelName: "Permission for Road Cut",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          report_problem
        </i>
      ),
      route: "roadcut-search",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
  ];
  cardItems = cardlist;
} else if (
  role_name === "OSD" ||
  role_name === "COMMISSIONER" ||
  role_name === "AD" ||
  role_name === "JEX"
) {
  const cardlist = [
    {
      label: {
        labelKey: "Permission for Advertisement",
        labelName: "Permission for Advertisement",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          report_problem
        </i>
      ),
      route: "advertisement-search",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
  ];
  cardItems = cardlist;
} else if (role_name === "SUPERINTENDENT") {
  const cardlist = [
    // {
    // label: {
    // labelKey: "Permission to Keep Pet Dog",
    // labelName: "Permission to Keep Pet Dog"
    // },
    // icon: <i
    // viewBox="0 -8 35 42"
    // color="primary"
    // font-size="40px"
    // class="material-icons module-page-icon">
    // pets
    // </i>,
    // route: "search"

    // },
    {
      label: {
        labelKey: "Permission to Sell Meat",
        labelName: "Permission to Sell Meat",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          restaurant
        </i>
      ),
      route: "sellmeat-search",
    },
    {
      label: {
        labelKey: "Permission for Advertisement",
        labelName: "Permission for Advertisement",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          picture_in_picture
        </i>
      ),
      route: "advertisement-search",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
  ];
  cardItems = cardlist;
}

const PermissionManagementSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    let UsertenantInfo = JSON.parse(getUserInfo()).permanentCity;
    setOPMSTenantId(UsertenantInfo);
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
            history: {},
          },
        },
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-services",
        //   componentPath: "HowItWorks",
        // },
      },
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home",
      },
      children: {
        popup: {},
      },
    },
  },
};

export default PermissionManagementSearchAndResult;
