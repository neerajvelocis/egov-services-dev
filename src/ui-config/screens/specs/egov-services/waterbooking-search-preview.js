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
import { gotoApplyWithStep } from "../utils/index";
import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill } from "../utils/index";
import generatePdf from "../utils/receiptPdf";
import {
    generateBill,
} from "../utils";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { applicantSummary  } from "./searchResource/applicantSummary";
import { waterTankerSummary } from "./searchResource/waterTankerSummary";
import { estimateSummary } from "./searchResource/estimateSummary";
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
    getAccessToken,
    getTenantId,
    getLocale,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsView,
    getSearchResultsForNocCretificate,
    getSearchResultsForNocCretificateDownload,
} from "../../../../ui-utils/commons";
import {
    preparepopupDocumentsSellMeatUploadData,
    prepareDocumentsUploadData,
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const undertakingButton1 = getCommonContainer({
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
                align: "right",
            },
        },
        children: {
            submitButtonLabel: getLabel({
                labelName: "Resend",
                labelKey: "PM_COMMON_BUTTON_RESEND",
            }),
            submitButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                    iconName: "keyboard_arrow_right",
                },
            },
        },
        onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
                gotoApplyWithStep(state, dispatch, 0);
            },
        },
        visible: bookingStatus === "REASSIGN" ? true : false,
    },
});

// const undertakingButton = getCommonContainer({
//   addPenaltyRebateButton: {
//     componentPath: "Button",
//     props: {
//       variant: "contained",
//       color: "primary",
//       style: {
//         minWidth: "200px",
//         height: "48px",
//         marginRight: "40px",
//       },
//     },
//     children: {
//       previousButtonLabel: getLabel({
//         labelName: "Undertaking",
//         labelKey: "NOC_UNDERTAKING",
//       }),
//     },
//     onClickDefination: {
//       action: "condition",
//       callBack: (state, dispatch) =>
//         showHideAdhocPopup(state, dispatch, "waterbooking-search-preview"),
//     },
//   },
// });

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
                },
                // { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatNOCRemarksDocuments" }] }
            ],
        },
    };
    try {
        let payload = null;
        // alert('in payload')
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
    },
    // downloadMenu: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "MenuButton",
    //   props: {
    //     data: {
    //       label: "Download",
    //       leftIcon: "cloud_download",
    //       rightIcon: "arrow_drop_down",
    //       props: { variant: "outlined", style: { marginLeft: 10 } },
    //       menu: [],
    //     },
    //   },
    // },
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

const setDownloadMenu = (state, dispatch) => {
    /** MenuButton data based on status */
    let downloadMenu = [];

    //Object creation for NOC's
    let certificateDownloadObjectPET = {
        label: {
            labelName: "NOC Certificate PET",
            labelKey: "NOC_CERTIFICATE_PET",
        },
        link: () => {
            window.location.href = httpLinkPET;
            generatePdf(state, dispatch, "certificate_download");
        },
        leftIcon: "book",
    };

    downloadMenu = [certificateDownloadObjectPET];

    dispatch(
        handleField(
            "waterbooking-search-preview",
            "components.div.children.headerDiv.children.header.children.downloadMenu",
            "props.data.menu",
            downloadMenu
        )
    );
    /** END */
};

const HideshowEdit = (action, bookingStatus) => {
    // Hide edit buttons
    let showEdit = false;
    if (bookingStatus === "REASSIGN") {
        showEdit = true;
    }
    set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.waterTankerSummary.children.cardContent.children.header.children.editSection.visible",
        role_name === "CITIZEN" ? (showEdit === true ? true : false) : false
    );
    set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
        role_name === "CITIZEN" ? (showEdit === true ? true : false) : false
    );

    set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.taskStatusSummary.children.cardContent.children.header.children.editSection.visible",
        false
    );

    set(
        action,
        "screenConfig.components.adhocDialog.children.popup",
        getRequiredDocuments()
    );
};
const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
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

    if(recData[0].bkStatus == "Paid"){
        await generateBill(state, dispatch, applicationNumber, tenantId, "BWT");
    } else {
        set(
            action,
            "screenConfig.components.div.children.body.children.cardContent.children.estimateSummary.visible",
            false
        );
    }

    let bookingCase = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkStatus",
        {}
    );

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
        bookingCase
    );

    const CitizenprintCont = footerReviewTop(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        bookingCase
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

          
          
    // if (role_name == "CITIZEN") {
    //     //   console.log("in Citizen");

    //     //   // setSearchResponseForNocCretificate(state,  dispatch, applicationNumber, tenantId);
    //     setDownloadMenu(state, dispatch);
    // }
};

let httpLinkPET;
let httpLinkSELLMEAT = "";

const setSearchResponseForNocCretificate = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    let downloadMenu = [];
    //bookingStatus = get(state, "screenConfiguration.preparedFinalObject.Booking.applicationstatus", {});
    let nocRemarks = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bookingsRemarks",
        {}
    );
    console.log(nocRemarks, "nocRemarks");

    let bookingStatus = "";

    var resApproved = nocRemarks.filter(function (item) {
        return item.bkApplicationStatus == "APPROVED";
    });

    if (resApproved.length != 0) bookingStatus = "APPROVED";

    if (bookingStatus == "APPROVED") {
        let getCertificateDataForSELLMEAT = {
            applicationType: "SELLMEATNOC",
            tenantId: tenantId,
            applicationId: applicationNumber,
            dataPayload: { requestDocumentType: "certificateData" },
        };

        //SELLMEAT
        const response0SELLMEAT = await getSearchResultsForNocCretificate([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
            { key: "getCertificateData", value: getCertificateDataForSELLMEAT },
            {
                key: "requestUrl",
                value: "/pm-services/noc/_getCertificateData",
            },
        ]);

        if (get(response0SELLMEAT, "ResposneInfo.status", "") == "") {
            let errorMessage = {
                labelName: "No Certificate Information Found",
                labelKey: "", //UPLOAD_FILE_TOAST
            };
            dispatch(toggleSnackbar(true, errorMessage, "error"));
        } else {
            let getFileStoreIdForSELLMEAT = {
                Booking: [get(response0SELLMEAT, "Booking", "")],
            };

            const response1SELLMEAT = await getSearchResultsForNocCretificate([
                { key: "tenantId", value: tenantId },
                { key: "applicationNumber", value: applicationNumber },
                {
                    key: "getCertificateDataFileStoreId",
                    value: getFileStoreIdForSELLMEAT,
                },
                {
                    key: "requestUrl",
                    value:
                        "/pdf-service/v1/_create?key=sellmeat-noc&tenantId=" +
                        tenantId,
                },
            ]);

            const response2SELLMEAT = await getSearchResultsForNocCretificateDownload(
                [
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: applicationNumber },
                    {
                        key: "filestoreIds",
                        value: get(response1SELLMEAT, "filestoreIds[0]", ""),
                    },
                    {
                        key: "requestUrl",
                        value:
                            "/filestore/v1/files/url?tenantId=" +
                            tenantId +
                            "&fileStoreIds=",
                    },
                ]
            );
            httpLinkSELLMEAT = get(
                response2SELLMEAT,
                get(response1SELLMEAT, "filestoreIds[0]", ""),
                ""
            );
        }
        //Object creation for NOC's
        let certificateDownloadObjectSELLMEAT = {
            label: {
                labelName: "NOC Certificate SELLMEAT",
                labelKey: "NOC_CERTIFICATE_SELLMEAT",
            },
            link: () => {
                if (httpLinkSELLMEAT != "")
                    window.location.href = httpLinkSELLMEAT;
            },
            leftIcon: "book",
        };

        downloadMenu = [certificateDownloadObjectSELLMEAT];
    }

    dispatch(
        handleField(
            "waterbooking-search-preview",
            "components.div.children.headerDiv.children.header.children.downloadMenu",
            "props.data.menu",
            downloadMenu
        )
    );
    //setDownloadMenu(state, dispatch);
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "waterbooking-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        setapplicationNumber(applicationNumber);
        const tenantId = getQueryArg(window.location.href, "tenantId");
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    
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
                    waterTankerSummary: waterTankerSummary,
                    taskStatusSummary: taskStatusSummary,
                }),
                break: getBreak(),

                // footer: footer,
            },
        },
    },
};

export default screenConfig;
