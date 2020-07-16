import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceOpenSpace/footer";
import { nocDetails } from "./applyResourceOpenSpace/nocDetails";
import { documentDetails } from "./applyResourceOpenSpace/documentDetails";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo, setapplicationType, IsRemoveItem, lSRemoveItemlocal, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
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
  { labelName: "Applicant Details", labelKey: "BK_OSB_APPLICANT_DETAILS" },
  { labelName: "Documents", labelKey: "BK_OSB_DOCUMENTS" },
  { labelName: "Summary", labelKey: "BK_OSB_SUMMARY" }
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
    // labelName: `Apply New Permission for Sell Meat NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelName: `Apply New Booking`, //later use getFinancialYearDates
    labelKey: "BK_OSB_APPLY"
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

export const formwizardThirdStep = {
  // This is for step 4
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    //documentuploadDetails
  },
  visible: false
};


const getMdmsData = async (action, state, dispatch) => {
  let tenantId = getTenantId();
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
              name: "sector"
            },
            {
              name: "propertyType"
            },
            {
              name: "storageArea"
            },
            {
              name: "duration"
            },
            {
              name: "category"
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

    // payload.MdmsRes.SellMeatNOC.SellMeatDocuments = [
    //   {
    //   active: true,
    //   code: "SELLMEAT.PROOF_POSSESSION_RENT_AGREEMENT",
    //   description: "SELLMEAT.PROOF_POSSESSION_RENT.PROOF_POSSESSION_RENT_AGREEMENT_DESCRIPTION",
    //   documentType: "SELLMEAT",
    //   dropdownData: [],
    //   hasDropdown: false,
    //   required: true
    // }]
    payload.MdmsRes.egpm.sector = [
      {id : 1, code:'1_sector', tenantId : 'ch.chandigarh', name : 'Sector 1', active : true},
      {id : 2, code:'2_sector', tenantId : 'ch.chandigarh', name : 'Sector 2', active : true}
    ]
    payload.MdmsRes.egpm.propertyType = [
      {id : 1, code:'residential', tenantId : 'ch.chandigarh', name : 'Residential', active : true},
      {id : 2, code:'commercial', tenantId : 'ch.chandigarh', name : 'Commercial', active : true}
    ]
    payload.MdmsRes.egpm.storageArea = [
      {id : 1, code:'less than 1000 sq.ft', tenantId : 'ch.chandigarh', name : 'Less than 1000 sq.ft', active : true},
      {id : 2, code:'more than 1000 sq.ft', tenantId : 'ch.chandigarh', name : 'More than 1000 sq.ft', active : true}
    ]
    payload.MdmsRes.egpm.duration = [
      {id : 1, code:'1 month', tenantId : 'ch.chandigarh', name : '1 Month', active : true},
      {id : 2, code:'2 month', tenantId : 'ch.chandigarh', name : '2 Month', active : true},
      {id : 3, code:'3 month', tenantId : 'ch.chandigarh', name : '3 Month', active : true},
      {id : 4, code:'4 month', tenantId : 'ch.chandigarh', name : '4 Month', active : true},
      {id : 5, code:'5 month', tenantId : 'ch.chandigarh', name : '5 Month', active : true},
      {id : 6, code:'6 month', tenantId : 'ch.chandigarh', name : '6 Month', active : true}
    ]
    payload.MdmsRes.egpm.category = [
      {id : 1, code:'cat-a', tenantId : 'ch.chandigarh', name : 'Cat-A', active : true},
      {id : 2, code:'cat-b', tenantId : 'ch.chandigarh', name : 'Cat-B', active : true},
      {id : 3, code:'cat-c', tenantId : 'ch.chandigarh', name : 'Cat-C', active : true}
    ]

    console.log("payload.MdmsRes", payload.MdmsRes);
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
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
    let slelmeatnocdetail = get(state, "screenConfiguration.preparedFinalObject.SELLMEATNOC", {});
    let uploadVaccinationCertificate = slelmeatnocdetail.hasOwnProperty('uploadDocuments') ?
      slelmeatnocdetail.uploadDocuments[0]['fileStoreId'] : '';

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
  name: "applyopenspace",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('SELLMEATNOC');
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    const userInfo = JSON.parse(getUserInfo());
    const applicantName = userInfo.hasOwnProperty('name') && userInfo.name != null ? userInfo.name : '';
    const fatherHusbandName = userInfo.hasOwnProperty('fatherOrHusbandName') && userInfo.fatherOrHusbandName != null ? userInfo.fatherOrHusbandName : '';
    dispatch(prepareFinalObject("SELLMEATNOC.applicantName", JSON.parse(getUserInfo()).name));
    dispatch(prepareFinalObject("SELLMEATNOC.houseNo", JSON.parse(getUserInfo()).permanentAddress));
    dispatch(prepareFinalObject("SELLMEATNOC.emailId", JSON.parse(getUserInfo()).emailId));
    dispatch(prepareFinalObject("SELLMEATNOC.mobileNumber", JSON.parse(getUserInfo()).mobileNumber));
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
        "formwizardSecondStep",

        "formwizardThirdStep"
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
        formwizardThirdStep,

        footer
      }
    }
  }
};

export default screenConfig;
