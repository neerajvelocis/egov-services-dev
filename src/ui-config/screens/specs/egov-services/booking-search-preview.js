import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getLabelWithValue,
    getLabel,
    getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    localStorageGet,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getFileUrlFromAPI,
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { openSpacePaymentGatewaySelectionPopup } from "./payResource/adhocPopup";
import {
    generateBill,
} from "../utils";
import { applicantSummary } from "./searchResource/applicantSummary";
import { openSpaceSummary } from "./searchResource/openSpaceSummary";
import { estimateSummary } from "./searchResource/estimateSummary";
import { documentsSummary } from "./searchResource/documentsSummary";
import { taskStatusSummary } from "./searchResource/taskStatusSummary";
import { footer } from "./searchResource/citizenFooter";
import {
    footerReview,
    downloadPrintContainer,
    footerReviewTop,
} from "./searchResource/footer";
import {
    SellMeatReassign,
    SellMeatReject,
    SellMeatForward,
    SellMeatApprove,
} from "./payResource/adhocPopup";
import {
    getLocale,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsView
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    }
});

const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];

    // Get all documents from response
    let bookingDocs = get(
        state,
        "screenConfiguration.preparedFinalObject.BookingDocument",
        {}
    );

    if (Object.keys(bookingDocs).length > 0) {
        let keys = Object.keys(bookingDocs);
        let values = Object.values(bookingDocs);
        let id = keys[0],
            fileName = values[0];

        documentsPreview.push({
            title: "DOC_DOC_PICTURE",
            fileStoreId: id,
            linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
            fileStoreIds.length > 0
                ? await getFileUrlFromAPI(fileStoreIds)
                : {};
        documentsPreview = documentsPreview.map(function (doc, index) {
            doc["link"] =
                (fileUrls &&
                    fileUrls[doc.fileStoreId] &&
                    fileUrls[doc.fileStoreId].split(",")[0]) ||
                "";
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

const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
    console.log("actionnew", action);
    let showFooter = false;
    if (bookingStatus === "PENDINGPAYMENT") {
        showFooter = true;
    }
    // set(
    //     action,
    //     "screenConfig.components.div.children.footer.children.cancelButton.visible",
    //     role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    // );
    set(
        action,
        "screenConfig.components.div.children.footer.children.submitButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
};

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId
) => {
    const response = await getSearchResultsView([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);
    let recData = get(response, "bookingsModelList", []);
    dispatch(
        prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
    );
    dispatch(
        prepareFinalObject("BookingDocument", get(response, "documentMap", {}))
    );

    await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].bkBookingType);
    

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus",
        {}
    );
    localStorageSet("bookingStatus", bookingStatus);
    HideshowFooter(action, bookingStatus);

    prepareDocumentsView(state, dispatch);

    const printCont = downloadPrintContainer(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        ""
    );

    const CitizenprintCont = footerReviewTop(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        ""
    );

    process.env.REACT_APP_NAME === "Citizen"
        ? set(
              action,
              "screenConfig.components.div.children.headerDiv.children.helpSection.children",
              CitizenprintCont
          )
        : set(
              action,
              "screenConfig.components.div.children.headerDiv.children.helpSection.children",
              printCont
          );
};


// const fetchBill = async (state, dispatch, applicationNumber, tenantId) => {
//     await generateBill(state, dispatch, applicationNumber, tenantId);
//     // let payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp");

//     // console.log("payloadnewpay");

//     //Collection Type Added in CS v1.1
//     // payload && dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].billDetails[0].collectionType", "COUNTER"));

//     // if (get(payload, "totalAmount") != undefined) {
//     //   //set amount paid as total amount from bill - destination changed in CS v1.1
//     //   dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid", payload.totalAmount));
//     //   //set total amount in instrument
//     //   dispatch(prepareFinalObject("ReceiptTemp[0].instrument.amount", payload.totalAmount));
//     // }

//     // //Initially select instrument type as Cash
//     // dispatch(prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash"));

//     // //set tenantId
//     // dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

//     // //set tenantId in instrument
//     // dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));
// };
const getPaymentGatwayList = async (action, state, dispatch) => {
    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/pg-service/gateway/v1/_search",
        "_search",
        [],
        {}
      );
        let payloadprocess = [];
        for (let index = 0; index < payload.length; index++) {
          const element = payload[index];
          let pay = {
            element : element
          }
          payloadprocess.push(pay);
        }
  
      dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
    } catch (e) {
      console.log(e);
    }
  };


const screenConfig = {
    uiFramework: "material-ui",
    name: "booking-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        setapplicationNumber(applicationNumber);
        const tenantId = getQueryArg(window.location.href, "tenantId");
        dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        // fetchBill(state, dispatch, applicationNumber, tenantId);
        getPaymentGatwayList(action, state, dispatch).then(response => {
        });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "OSBM" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);

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
                                sm: 8,
                            },
                            ...titlebar,
                        },
                        helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                                color: "primary",
                                style: { justifyContent: "flex-end" },
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right",
                            },
                        },
                    },
                },
                // taskStatus: {
                //   uiFramework: "custom-containers-local",
                //   componentPath: "WorkFlowContainer",
                //   moduleName: "egov-workflow",
                //   visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
                //   props: {
                //     dataPath: "Licenses",
                //     moduleName: "SELLMEATNOC",
                //   },
                // },
                body: getCommonCard({
                    estimateSummary: estimateSummary,
                    applicantSummary : applicantSummary,
                    openSpaceSummary: openSpaceSummary,
                    documentsSummary: documentsSummary,
                    taskStatusSummary: taskStatusSummary,
                    // undertakingButton1,
                }),
                break: getBreak(),
                footer: footer,
            }
        }
    }
};

export default screenConfig;
