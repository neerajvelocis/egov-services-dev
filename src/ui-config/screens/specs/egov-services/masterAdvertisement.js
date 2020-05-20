import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResultsMaser } from "./searchResource/searchResults";
import { getMasterGridData, getSubCategory, getCategory } from "./searchResource/citizenSearchFunctions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;


export const datagridsummary = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "datagridsummary"
  },
  children: {
    searchResultsMaser
  }
};

const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getCategory(action, state, dispatch);
    getSubCategory(action, state, dispatch);
    getMasterGridData(action, state, dispatch);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css datagridsummary",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

        },

        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResultsMaser,
        //datagridsummary
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default NOCSearchAndResult;
