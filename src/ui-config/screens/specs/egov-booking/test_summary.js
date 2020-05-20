import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";


const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Fire NOC - Application Summary",
    labelKey: "NOC_SUMMARY_HEADER"
  })
});


  let documentsPreview = [];
 

const screenConfig = {
  uiFramework: "material-ui",
  name: "test_summary",
  
  
  
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        adhocDialog: {
		  uiFramework: "custom-containers-local",
		  moduleName: "egov-noc",
		  componentPath: "DialogContainer",
		  props: {
			open: true,
			maxWidth: false,
			screenKey: "test_summary"
		  },
		  children: {
			popup: {}
		  }
    }
       
      }
    }
  }
};

export default screenConfig;
