import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceSellMeat/footer";
import { nocDetails } from "./applyResourceSellMeat/nocDetails";
import { documentDetails } from "./applyResourceSellMeat/documentDetails";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId, getUserInfo, setapplicationType, IsRemoveItem, lSRemoveItemlocal, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import jp from "jsonpath";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadDataForSellMeat,
  prepareDocumentsUploadData,
  getSearchResultsView,
  furnishSellMeatNocResponse,
  setApplicationNumberBox
} from "../../../../ui-utils/commons";



// export const stepsData = [
//   { labelName: "Sell Meat NOC Details", labelKey: "SELLMEATNOC_APPLICANT_DETAILS_NOC" },
//   { labelName: "Documents", labelKey: "SELLMEATNOC_STEP_DOCUMENTS_NOC" },
//   { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
// ];
// export const stepper = getStepperObject(
//   { props: { activeStep: 0 } },
//   stepsData
// );

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-opms",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply For New Location`,
    labelKey: "BK_OSB_APPLY_NEW_LOCATION"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    nocDetails
  }
};


const getMdmsData = async (action, state, dispatch) => {
  let tenantId = getOPMSTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "egpm",
          masterDetails: [
            {
              name: "nocSought"
            },
            {
              name: "sector"
            }
          ]
        },
        { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.egpm.sector = [
      {id : 1, code:'1_sector', tenantId : 'ch.chandigarh', name : 'Sector 1', active : true},
      {id : 2, code:'2_sector', tenantId : 'ch.chandigarh', name : 'Sector 2', active : true}
    ]
    payload.MdmsRes.egpm.nocSought = [
      {id : 1, code:'residential', tenantId : 'ch.chandigarh', name : 'Residential', active : true},
      {id : 2, code:'commercial', tenantId : 'ch.chandigarh', name : 'Commercial', active : true}
    ]
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "applylocation",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('SELLMEATNOC');
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    const userInfo = JSON.parse(getUserInfo());
    const applicantName = userInfo.hasOwnProperty('name') && userInfo.name != null ? userInfo.name : '';
    const fatherHusbandName = userInfo.hasOwnProperty('fatherOrHusbandName') && userInfo.fatherOrHusbandName != null ? userInfo.fatherOrHusbandName : '';
    dispatch(prepareFinalObject("SELLMEATNOC.applicantName", applicantName));
    dispatch(prepareFinalObject("SELLMEATNOC.fatherHusbandName", fatherHusbandName));
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
    });

    return action;
  },
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
        formwizardFirstStep,
        footer
      }
    }
  }
};

export default screenConfig;
