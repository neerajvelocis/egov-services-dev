import {
    getCommonHeader,
    getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { CloudDownloadIcon } from "@material-ui/icons/CloudDownload";
import { PrintIcon } from "@material-ui/icons/Print";
// import {
//     // applicationSuccessFooter,
//     gotoHomeFooter,
//     approvalSuccessFooter,
//     paymentFailureFooter,
// } from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResultsView } from "../../../../ui-utils/commons";
import {
    downloadReceipt,
    downloadCertificate,
    downloadApplication,
} from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Application for ${
            getapplicationType() === "OSBM"
                ? "Open Space to Store Building Material"
                : "Water Tanker"
        } (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
        labelKey: "",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getQueryArg(window.location.href, "applicationNumber"),
        },
        visible: true,
    },
});

export const paymentSuccessFooter = (
    state,
    applicationNumber,
    tenantId,
    businessService
) => {
    return getCommonApplyFooter({
        //call gotoHome
        downloadReceiptButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD RECEIPT",
                    labelKey: "BK_BUTTON_DOWNLOAD_RECEIPT",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadReceipt(state, applicationNumber, tenantId);
                },
            },
        },
        downloadPermissionLetterButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD PERMISSION LETTER",
                    labelKey: "BK_BUTTON_DOWNLOAD_PERMISSION_LETTER",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    //// generatePdf(state, dispatch, "receipt_download");
                    downloadCertificate(state, applicationNumber, tenantId);
                },
            },
            visible: businessService === "OSBM" ? true : false,
        },
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    //    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                goToHomeButtonLabel: getLabel({
                    labelName: "GO TO HOME",
                    labelKey: "BK_BUTTON_HOME",
                }),
            },
            onClickDefination: {
                action: "page_change",
                path:
                    process.env.REACT_APP_SELF_RUNNING === "true"
                        ? `/egov-ui-framework/egov-services/search`
                        : `/`,
            },
            visible: true,
        },
    });
};
export const paymentFailureFooter = ( state,
    applicationNumber,
    tenantId,
    businessService) => {
    return getCommonApplyFooter({
      //Call gotoHome
      retryPayment: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
          //  minWidth: "200px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          downloadReceiptButtonLabel: getLabel({
            labelName: "RETRY",
            labelKey: "BK_BUTTON_PAYMENT_RETRY"
          })
        },
        onClickDefination: {
          action: "page_change",
          path: `/egov-services/pay?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
        }
      }
    });
  };
export const applicationSuccessFooter = (
    state,
    applicationNumber,
    tenantId,
    businessService
) => {
    return getCommonApplyFooter({
        downloadApplicationButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    //   minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "DOWNLOAD APPLICATION",
                    labelKey: "BK_BUTTON_DOWNLOAD_APPLICATION",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                    downloadApplication(state, applicationNumber, tenantId);
                },
            },
        },
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    //    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                goToHomeButtonLabel: getLabel({
                    labelName: "GO TO HOME",
                    labelKey: "BK_BUTTON_HOME",
                }),
            },
            onClickDefination: {
                action: "page_change",
                path:
                    process.env.REACT_APP_SELF_RUNNING === "true"
                        ? `/egov-ui-framework/egov-services/search`
                        : `/`,
            },
            visible: true,
        },
    });
};

const getCommonApplyFooter = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer",
        },
        children,
    };
};
const getAcknowledgementCard = (
    state,
    dispatch,
    purpose,
    status,
    applicationNumber,
    secondNumber,
    tenantId,
    businessService
) => {
    if (purpose === "apply" && status === "success") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelName: "Application Submitted Successfully",
                            labelKey: "BK_APPLICATION_SUCCESS_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding Application Submission has been sent to the applicant registered Mobile No.",
                            labelKey: "BK_APPLICATION_SUCCESS_MESSAGE_SUB",
                        },

                        tailText: {
                            labelName: "Application No.",
                            labelKey: "BK_APP_NO_LABEL",
                        },
                        number: applicationNumber,
                    }),
                },
            },

            applicationSuccessFooter: applicationSuccessFooter(
                state,
                applicationNumber,
                tenantId,
                businessService
            ),
        };
    } else if (purpose === "pay" && status === "success") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelName:
                                "Payment has been collected successfully!",
                            labelKey:
                                "BK_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding Payment Collection has been sent to the applicant at registered Mobile No.",
                            labelKey: "BK_PAYMENT_SUCCESS_MESSAGE_SUB",
                        },
                        tailText: {
                            labelName: "Transaction No.",
                            labelKey: "BK_PMT_TXN_ID",
                        },
                        number: secondNumber,
                    }),
                },
            },
            paymentSuccessFooter: paymentSuccessFooter(
                state,
                applicationNumber,
                tenantId,
                businessService
            ),
        };
    } else if (purpose === "pay" && status === "failure") {
        return {
            header,
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "close",
                        backgroundColor: "#E54D42",
                        header: {
                            labelName: "Payment has failed!",
                            labelKey: "BK_PAYMENT_FAILURE_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding payment failure has been sent to the applicant.",
                            labelKey: "BK_PAYMENT_FAILURE_MESSAGE_SUB",
                        },
                    }),
                },
            },
            paymentFailureFooter: paymentFailureFooter(
                applicationNumber,
                tenantId
            ),
        };
    }
};

const setApplicationData = async (dispatch, applicationNumber, tenantId) => {
    const queryObject = [
        {
            key: "tenantId",
            value: tenantId,
        },
        {
            key: "applicationNumber",
            value: applicationNumber,
        },
    ];
    const response = await getSearchResultsView(queryObject);
    dispatch(
        prepareFinalObject("Booking", get(response, "bookingsModelList[0]", []))
    );
};



const screenConfig = {
    uiFramework: "material-ui",
    name: "acknowledgement",
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
            },
        },
    },
    beforeInitScreen: (action, state, dispatch) => {
        const purpose = getQueryArg(window.location.href, "purpose");
        const status = getQueryArg(window.location.href, "status");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const secondNumber = getQueryArg(window.location.href, "secondNumber");
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        const data = getAcknowledgementCard(
            state,
            dispatch,
            purpose,
            status,
            applicationNumber,
            secondNumber,
            tenantId,
            businessService
        );
        setApplicationData(dispatch, applicationNumber, tenantId);
        set(action, "screenConfig.components.div.children", data);
        return action;
    },
};

export default screenConfig;
