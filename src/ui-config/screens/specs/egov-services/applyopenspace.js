import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceOpenSpace/footer";
import {
  personalDetails,
  bookingDetails,
} from "./applyResourceOpenSpace/nocDetails";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceOpenSpace/documentDetails";
import { summaryDetails } from "./applyResourceOpenSpace/summaryDetails";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getOPMSTenantId,
  setapplicationType,
  lSRemoveItem,
  lSRemoveItemlocal,
  setapplicationNumber,
  getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import {
  sampleSearch,
  sampleSingleSearch,
  sampleDocUpload,
} from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import get from "lodash/get";

import {
  prepareDocumentsUploadData,
  getSearchResults,
  getSearchResultsView,
  setApplicationNumberBox,
  furnishNocResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
  { labelName: "Applicant Details", labelKey: "BK_OSB_APPLICANT_DETAILS" },
  { labelName: "Booking Details", labelKey: "BK_OSB_BOOKING_DETAILS" },
  { labelName: "Documents", labelKey: "BK_OSB_DOCUMENTS" },
  { labelName: "Summary", labelKey: "BK_OSB_SUMMARY" },
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
      moduleName: "egov-services",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden",
      },
      visible: true,
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply for open space`,
    labelKey: "BK_OSB_APPLY",
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "applicationNumberContainer",
    props: {
      number: "NA",
    },
    visible: false,
  },
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1",
  },
  children: {
    personalDetails,
  },
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2",
  },
  children: {
    bookingDetails,
  },
  visible: false,
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3",
  },
  children: {
    documentDetails,
  },
  visible: false,
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4",
  },
  children: {
    summaryDetails
  },
  visible: false,
};

const getMdmsData = async (action, state, dispatch) => {
  let tenantId = getOPMSTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
        {
          moduleName: "Booking",
          masterDetails: [
            {
              name: "Sector",
            },
            {
              name: "CityType",
            },
            {
              name: "PropertyType",
            },
            {
              name: "Area",
            },
            {
              name: "Duration",
            },
            {
              name: "Category",
            },
            {
              name: "Documents",
            },
          ],
        }
        
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

export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
    ]);

    let Refurbishresponse = furnishNocResponse(response);
    dispatch(prepareFinalObject("Booking", Refurbishresponse));
    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }

    // Set sample docs upload
    // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
    let documentsPreview = [];

    // Get all documents from response
    let petnocdetails = get(
      state,
      "screenConfiguration.preparedFinalObject.Booking",
      {}
    );
    let uploadVaccinationCertificate = petnocdetails.hasOwnProperty(
      "uploadVaccinationCertificate"
    )
      ? petnocdetails.uploadVaccinationCertificate[0]["fileStoreId"]
      : "";

    let uploadPetPicture = petnocdetails.hasOwnProperty("uploadPetPicture")
      ? petnocdetails.uploadPetPicture[0]["fileStoreId"]
      : "";

    if (uploadVaccinationCertificate !== "" && uploadPetPicture !== "") {
      documentsPreview.push(
        {
          title: "VACCINATION_CERTIFIACTE",
          fileStoreId: uploadVaccinationCertificate,
          linkText: "View",
        },
        {
          title: "PET_PICTURE",
          fileStoreId: uploadPetPicture,
          linkText: "View",
        }
      );
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      documentsPreview = documentsPreview.map(function (doc, index) {
        doc["link"] =
          (fileUrls &&
            fileUrls[doc.fileStoreId] &&
            fileUrls[doc.fileStoreId].split(",")[0]) ||
          "";
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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    !applicationNumber ? clearlocalstorageAppDetails(state) : "";
    setapplicationType("Booking");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
    // dispatch(
    //   prepareFinalObject(
    //     "Booking.bkApplicantName",
    //     JSON.parse(getUserInfo()).name
    //   )
    // ),
    //   dispatch(prepareFinalObject("Booking.bkEmail", "HELLO@GMAIL.COM"));
    // dispatch(
    //   prepareFinalObject(
    //     "Booking.bkMobileNumber",
    //     JSON.parse(getUserInfo()).mobileNumber
    //   )
    // );

    // dispatch(prepareFinalObject("Booking.bkHouseNo", "2"));
    // dispatch(prepareFinalObject("Booking.bkCompleteAddress", "hello address"));
    // dispatch(prepareFinalObject("Booking.bkSector", "SECTOR-1"));
    // dispatch(prepareFinalObject("Booking.bkType", "Residential"));
    // dispatch(prepareFinalObject("Booking.bkAreaRequired", "more_than_1000"));
    // dispatch(prepareFinalObject("Booking.bkDuration", "2_months"));
    // dispatch(prepareFinalObject("Booking.bkCategory", "Cat-A"));
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "services");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then((response) => {
      prepareDocumentsUploadData(state, dispatch, "apply_osb");
    });

    // Search in case of EDIT flow
    // prepareEditFlow(state, dispatch, applicationNumber, tenantId);

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
        "formwizardThirdStep",
        "formwizardFourthStep",
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
        className: "common-div-css",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10,
              },
              ...header,
            },
          },
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        footer,
      },
    },
  },
};

export default screenConfig;
