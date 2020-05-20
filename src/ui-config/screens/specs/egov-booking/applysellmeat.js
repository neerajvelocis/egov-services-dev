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
import { getOPMSTenantId,getUserInfo, setapplicationType,IsRemoveItem, lSRemoveItemlocal, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
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



export const stepsData = [
  { labelName: "Sell Meat NOC Details", labelKey: "SELLMEATNOC_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "SELLMEATNOC_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-noc",
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
    labelName: `Apply New Permission for Sell Meat NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "SELLMEAT_APPLY_NOC"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
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

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
};

// export const formwizardThirdStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form3"
//   },
//   children: {
//     documentDetails
// 	},
//   visible: false
// };

// export const formwizardThirdStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form3"
//   },
//   children: {
//     //documentuploadDetails
//   },
//   visible: false
// };


// const getMdmsData = async (action, state, dispatch) => {
// // let tenantId =
// //  get(
// //    state.screenConfiguration.preparedFinalObject,
// //    "PETNOC.[0].fireNOCDetails.propertyDetails.address.city"
// //  ) || getOPMSTenantId();
// let tenantId = getOPMSTenantId();
// // alert("call mdmsdata")
// let mdmsBody = {
// MdmsCriteria: {
// tenantId: tenantId,
// moduleDetails: [
// // {
// // moduleName: "common-masters",
// // masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
// // },
// // {
// // moduleName: "firenoc",
// // masterDetails: [{ name: "BuildingType" }, { name: "FireStations" }]
// // },
// // {
// // moduleName: "egov-location",
// // masterDetails: [
// // {
// // name: "TenantBoundary"
// // }
// // ]
// // },
// {
// moduleName: "tenant",
// masterDetails: [
// {
// name: "tenants"
// }
// ]
// },
// {
// moduleName: "egpm",
// masterDetails: [
// {
// name: "nocSought"
// },
// {
// name: "sector"
// }
// ]
// }, 
// { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatDocuments" }] }
// ]
// }
// };
// try {
// let payload = null;
// payload = await httpRequest(
// "post",
// "/egov-mdms-service/v1/_search",
// "_search",
// [],
// mdmsBody
// );
// dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
// } catch (e) {
// console.log(e);
// }
// };


const getMdmsData = async (action, state, dispatch) => {
  // let tenantId =
  //  get(
  //    state.screenConfiguration.preparedFinalObject,
  //    "PETNOC.[0].fireNOCDetails.propertyDetails.address.city"
  //  ) || getOPMSTenantId();
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
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};


const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};

const setCardsIfMultipleBuildings = (state, dispatch) => {
  if (
    get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings"
    ) === "MULTIPLE"
  ) {
    dispatch(
      handleField(
        "applysellmeat",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer",
        "props.style",
        { display: "none" }
      )
    );
    dispatch(
      handleField(
        "applysellmeat",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer",
        "props.style",
        {}
      )
    );
  }
};


export const prepareEditFlow = async (state, dispatch, applicationNumber, tenantId) => {
  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber }
    ]);
    let Refurbishresponse = furnishSellMeatNocResponse(response);

    dispatch(prepareFinalObject("SELLMEATNOC", Refurbishresponse));
    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }

    let documentsPreview = [];

    // Get all documents from response
    let firenoc = get(state, "screenConfiguration.preparedFinalObject.SELLMEATNOC", {});
    let uploadVaccinationCertificate = firenoc.hasOwnProperty('uploadDocuments') ?
      firenoc.uploadDocuments[0]['fileStoreId'] : '';
    
    if (uploadVaccinationCertificate !== '') {
      documentsPreview.push({
        title: "PROOF_POSSESSION_RENT_AGREEMENT",
        fileStoreId: uploadVaccinationCertificate,
        linkText: "View"
      });
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      documentsPreview = documentsPreview.map(function (doc, index) {

        doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
        //doc["name"] = doc.fileStoreId;
        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
        return doc;
      });
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "applysellmeat",
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

      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');
    });

    // Search in case of EDIT flow
    prepareEditFlow(state, dispatch, applicationNumber, tenantId);


    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep"
      ];
      for (let i = 0; i < 4; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }

    // Set defaultValues of radiobuttons and selectors
    let noOfBuildings = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings",
      "SINGLE"
    );
    set(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings",
      noOfBuildings
    );
    let nocType = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.fireNOCType",
      "PROVISIONAL"
    );
    set(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.fireNOCType",
      nocType
    );

    // Preset multi-cards (CASE WHEN DATA PRE-LOADED)
    if (
      get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings"
      ) === "MULTIPLE"
    ) {
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer.props.style",
        {}
      );
    }
    if (
      get(
        state,
        "screenConfiguration.preparedFinalObject.EGOVOPMS[0].fireNOCDetails.fireNOCType"
      ) === "PROVISIONAL"
    ) {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber.props.style",
        { visibility: "hidden" }
      );
    }


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
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        footer
      }
    }
  }
};

export default screenConfig;
