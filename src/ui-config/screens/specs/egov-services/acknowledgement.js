import {
    getCommonHeader,
    getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { CloudDownloadIcon } from "@material-ui/icons/CloudDownload";
import { PrintIcon } from "@material-ui/icons/Print";
import {
    applicationSuccessFooter,
    gotoHomeFooter,
    approvalSuccessFooter,
    paymentFailureFooter,
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResultsView } from "../../../../ui-utils/commons";
import { downloadReceipt, downloadCertificate, downloadApplication } from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
//import  generatePdf from "../utils/receiptPdf";
import { Icon } from "egov-ui-framework/ui-atoms";
// import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getSearchResultsForNocCretificate,
    getSearchResultsForNocCretificateDownload,
} from "../../../../ui-utils/commons";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Application for ${getapplicationType() === "OSBM"?"Open Space to Store Building Material" : "Water Tanker"} (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
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

const getHeader = (applicationNumber) => {
    return getCommonContainer({
        header: getCommonHeader({
            labelName: `Application for PET NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
            labelKey: "",
        }),
        applicationNumber: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-services",
            componentPath: "ApplicationNoContainer",
            props: {
                number: applicationNumber,
            },
            visible: true,
        },
    });
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
    if (purpose === "pay" && status === "success") {
        // loadPdfGenerationData(applicationNumber, tenantId);
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
    } if (purpose === "pay" && status === "failure") {
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
                            labelKey: "NOC_PAYMENT_FAILURE_MESSAGE_MAIN",
                        },
                        body: {
                            labelName:
                                "A notification regarding payment failure has been sent to the applicant.",
                            labelKey: "PET_NOC_PAYMENT_FAILURE_MESSAGE_SUB",
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
    dispatch(prepareFinalObject("Booking", get(response, "bookingsModelList[0]", [])));
};

const setSearchResponseForNocCretificate = async (
    applicationNumber,
    tenantId
) => {
    //Receipts
    let getCertificateDataFor_RECEIPT = {
        applicationType: getapplicationType(),
        tenantId: tenantId,
        applicationId: applicationNumber,
        dataPayload: { requestDocumentType: "receiptData" },
	};
	
	

    //NOC_Receipts
    const response0_RECEIPT = await getSearchResultsForNocCretificate([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        { key: "getCertificateData", value: getCertificateDataFor_RECEIPT },
        { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" },
    ]);

    let getFileStoreIdFor_RECEIPT = {
        nocApplicationDetail: [
            get(response0_RECEIPT, "nocApplicationDetail[0]", ""),
        ],
    };

    let receiptName = "";
    switch (getapplicationType()) {
        case "PETNOC":
            receiptName =
                "/pdf-service/v1/_create?key=pet-receipt&tenantId=" + tenantId;
            break;
        case "ROADCUTNOC":
            receiptName =
                "/pdf-service/v1/_create?key=roadcut-receipt&tenantId=" +
                tenantId;
            break;
        case "ADVERTISEMENTNOC":
            receiptName =
                "/pdf-service/v1/_create?key=advertisement-receipt&tenantId=" +
                tenantId;
            break;
    }
    const response1_RECEIPT = await getSearchResultsForNocCretificate([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        {
            key: "getCertificateDataFileStoreId",
            value: getFileStoreIdFor_RECEIPT,
        },
        { key: "requestUrl", value: receiptName },
    ]);

    const response2_RECEIPT = await getSearchResultsForNocCretificateDownload([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        {
            key: "filestoreIds",
            value: get(response1_RECEIPT, "filestoreIds[0]", ""),
        },
        {
            key: "requestUrl",
            value:
                "/filestore/v1/files/url?tenantId=" +
                tenantId +
                "&fileStoreIds=",
        },
    ]);

    let httpLink_RECEIPT = get(
        response2_RECEIPT,
        get(response1_RECEIPT, "filestoreIds[0]", ""),
        ""
    );
    //window.open(httpLink_RECEIPT,  "_blank");
    if (httpLink_RECEIPT != "") window.location.href = httpLink_RECEIPT;
};



export const paymentSuccessFooter = (state, applicationNumber, tenantId, businessService) => {
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
                    downloadReceipt(
						state, 
                        applicationNumber,
                        tenantId
                    );
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
                    downloadCertificate(
						state, 
                        applicationNumber,
                        tenantId
                    );
                },
            },
            visible : businessService === "OSBM" ? true : false
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
        const businessService = getQueryArg(window.location.href, "businessService");
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
