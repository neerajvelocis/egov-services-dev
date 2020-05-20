import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  localStorageGet, localStorageSet, setapplicationNumber, getOPMSTenantId, setapplicationType,
  getAccessToken, getLocale, getUserInfo, getapplicationType, getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { gotoApplyWithStep } from "../utils/index";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";

import { footer } from "./applyResource/employeeFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import { showHideAdhocPopup, showHideAdhocPopups } from "../utils";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { adhocPopup5, adhocPopup1, adhocPopup2, adhocPopup3, adhocPopup4 } from "./payResource/adhocPopup";
import {
  applicantSummary, institutionSummary
} from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { immunizationSummary } from "./summaryResource/immunizationSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import {
  getSearchResultsView, getSearchResultsForNocCretificate,
  getSearchResultsForNocCretificateDownload, preparepopupDocumentsUploadData, prepareDocumentsUploadData
} from "../../../../ui-utils/commons";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const undertakingButton1 = getCommonContainer({
  addPenaltyRebateButton1: {
    componentPath: "Checkbox",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "20",
        height: "10px",
        marginRight: "5px",
        marginTop: "15px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "search-preview")
    }
  },
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      // callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "search-preview")
    }
  },
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit",
        align: "right"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Resend",
        labelKey: "PM_COMMON_BUTTON_RESEND"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        gotoApplyWithStep(state, dispatch, 0);
      }
    },
    visible: localStorageGet("app_noc_status") == "REASSIGN" ? true : false

  }
});

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "wices",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getapplicationNumber(),
    }
  },
  downloadMenu: {
    uiFramework: "custom-atoms",
    componentPath: "MenuButton",
    props: {
      data: {
        label: "Download",
        leftIcon: "cloud_download",
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", style: { marginLeft: 10 } },
        menu: []
      }
    }
  }//,
  // printMenu: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Print",
  //       leftIcon: "print",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: []
  //     }
  //   }
  // }
});


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
              name: "color"
            },
            {
              name: "sector"
            },
            {
              name: "breed"
            },
            {
              name: "sex"
            },
            {
              name: "age"
            }
          ]
        },
        { moduleName: "PetNOC", masterDetails: [{ name: "Documents" }, { name: "RemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};



const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let petnocdetail = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]",
    {}
  );
  let uploadVaccinationCertificate = JSON.parse(petnocdetail.applicationdetail).hasOwnProperty('uploadVaccinationCertificate') ?
    JSON.parse(petnocdetail.applicationdetail).uploadVaccinationCertificate[0]['fileStoreId'] : '';

  let uploadPetPicture = JSON.parse(petnocdetail.applicationdetail).hasOwnProperty('uploadPetPicture') ?
    JSON.parse(petnocdetail.applicationdetail).uploadPetPicture[0]['fileStoreId'] : '';

  if (uploadVaccinationCertificate !== '' && uploadPetPicture !== '') {
    documentsPreview.push({
      title: "VACCINATION_CERTIFIACTE",
      fileStoreId: uploadVaccinationCertificate,
      linkText: "View"
    },
      {
        title: "PET_PICTURE",
        fileStoreId: uploadPetPicture,
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
};


const setSearchResponse = async (state, dispatch, action, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  
  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
  dispatch(prepareFinalObject("nocApplicationReceiptDetail", get(response, "nocApplicationDetail", [])));
  dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));
  
  dispatch(prepareFinalObject("PetNoc[0].PetNocDetails.Approve.badgeNumber", JSON.parse(response.nocApplicationDetail[0].applicationdetail).badgeNumber));

  let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  localStorageSet("app_noc_status", nocStatus);
  HideshowEdit(action, nocStatus);


  prepareDocumentsView(state, dispatch);
  
  if (role_name == 'CITIZEN') {
    
    setSearchResponseForNocCretificate(state, dispatch, action, applicationNumber, tenantId);
  }
};

let httpLinkPET;
let httpLinkPET_RECEIPT;

const HideshowEdit = (action, nocStatus) => {
  let showEdit = false;
  if (nocStatus === "REASSIGN") {
    showEdit = true;
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.immunizationSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.taskStatusSummary.children.cardContent.children.header.children.editSection.visible",
     false
  );

}
const setSearchResponseForNocCretificate = async (state, dispatch, action, applicationNumber, tenantId) => {

  let downloadMenu = [];
  let certificateDownloadObjectPET_RECEIPT = {};
  let certificateDownloadObjectPET = {};
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});
  //let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});

  
  let nocRemark = "";
  let nocStatus = "";

  var resApproved = nocRemarks.filter(function (item) {
    return item.applicationstatus == "APPROVED";
  });
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  if (resApproved.length != 0)
    nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";

  //role_name !== 'CITIZEN' ?
  if (nocStatus == "APPROVED") {
    let getCertificateDataForPET = { "applicationType": "PETNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //PETNOC
    const response0PET = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForPET },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForPET = { "nocApplicationDetail": [get(response0PET, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));
    
    const response1PET = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForPET },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=pet-noc&tenantId=" + tenantId }
    ]);

    const response2PET = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1PET, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId="+tenantId+"&fileStoreIds=" }
    ]);
    httpLinkPET = get(response2PET, get(response1PET, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectPET = {
      label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
      link: () => {
        if (httpLinkPET != "")
          window.location.href = httpLinkPET;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }
   if (nocRemark == "PAID") {
    //Receipts
    let getCertificateDataForPET_RECEIPT = { "applicationType": "PETNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //PETNOC_Receipts
    const response0PET_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForPET_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForPET_RECEIPT = { "nocApplicationDetail": [get(response0PET_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1PET_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForPET_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=pet-receipt&tenantId=" + tenantId }
    ]);

    const response2PET_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1PET_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId="+tenantId+"&fileStoreIds=" }
    ]);
    httpLinkPET_RECEIPT = get(response2PET_RECEIPT, get(response1PET_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectPET_RECEIPT = {
      label: { labelName: "NOC Receipt PET", labelKey: "NOC_RECEIPT_PET" },
      link: () => {
        if (httpLinkPET_RECEIPT != "")
          window.location.href = httpLinkPET_RECEIPT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }
  
  if (nocStatus == "APPROVED" && nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectPET,
      certificateDownloadObjectPET_RECEIPT
    ];
  } else if (nocStatus == "APPROVED") {
    downloadMenu = [
      certificateDownloadObjectPET
    ];
  } else if (nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectPET_RECEIPT
    ];
  }
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    setSearchResponse(state, dispatch, action, applicationNumber, tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "PETNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");
    setapplicationType('PETNOC');
    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_pet');
    });
    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments()
    );

    // Set Documents Data (TEMP)
    preparepopupDocumentsUploadData(state, dispatch, 'PETNOC');

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
              ...titlebar
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "Licenses",
            moduleName: "PETNOC",
          }

        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary

        })
          : getCommonCard({
            estimateSummary: estimateSummary,
            applicantSummary: applicantSummary,
            nocSummary: nocSummary,
            immunizationSummary: immunizationSummary,
            documentsSummary: documentsSummary,
            taskStatusSummary: taskStatusSummary,
            //undertakingButton1
          }),

        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
        footer: footer

      }
    },
    undertakingdialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "UnderTakingContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview"
      },
      children: {

        popup: {}
        //popup:adhocPopup1

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup1
        // popup:adhocPopup2

      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup2

      }
    },
    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: adhocPopup3
      }
    },
    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {

        popup: adhocPopup4

      }
    }
  }
};

export default screenConfig;
