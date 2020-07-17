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
    // labelKey: "BK_APPLY_BOOKINGS_HEADER",
    labelKey: "BK_APPLY",
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
        labelKey: "BK_HOME_OPEN_SPACE_BOOKING",
        labelName: "Book Open Space to Store Building Materials",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          account_balance
        </i>
      ),
      route: "applyopenspace",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
    {
      label: {
        labelKey: "BK_HOME_COMMUNITY_CENTRE_BOOKING",
        labelName: "Book Parks & Community Center/Banquet Halls",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          font-size="40px"
          class="material-icons module-page-icon"
        >
          event
        </i>
      ),
      route: "apply",
    },
    {
      label: {
        labelKey: "BK_HOME_GROUND_BOOKING",
        labelName: "Book Ground for Commercial Purpose"
      },
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        class="material-icons module-page-icon">
        group_work
      </i>,
      route: "apply"
      // {
      //   screenKey: "citizenMainLanding",
      //   jsonPath: "components.adhocDialog"
      // }
    },
    {
      label: {
        labelKey: "BK_HOME_OPEN_SPACE_MCC_JURISDICTION",
        labelName: "Book Open Space within MCC jurisdiction "
      },
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        class="material-icons module-page-icon">
        room
      </i>,
      route: "apply"
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    },
    {
      label: {
        labelKey: "BK_HOME_WATER_TANKER_BOOKING",
        labelName: "Book Water Tanker",
      },
      icon: (
        <i
          viewBox="0 -8 35 42"
          color="primary"
          class="material-icons module-page-icon"
        >
          invert_colors
        </i>
      ),
      route: "applywatertanker",
      // {
      //   screenKey: "home",
      //   jsonPath: "components.adhocDialog"
      // }
    }
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
