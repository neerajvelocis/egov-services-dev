import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak,
    getCommonGrayCard
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
import {
    generageBillCollection,
    generateBill,
} from "../utils";
import { pccSummary } from "./refundResource/pccSummary";

import { estimateSummary } from "./refundResource/estimateSummary";

import { footerForParkAndCC } from "./refundResource/citizenFooter";
import {
    footerReviewTop,
} from "./searchResource/footer";
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

const confirmationStatement = getCommonGrayCard({

    header: getCommonHeader({
        labelName: "Please confirm booking cancelation by clicking confirm button",
        labelKey: "BK_PACC_CONFIRMATION_MSG",
    })


})

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Application Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
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



const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
    // console.log("actionnew", action);
    let showFooter = false;
    if (bookingStatus === "APPLIED") {
        showFooter = true;
    }
    set(
        action,
        "screenConfig.components.div.children.footer.children.cancelButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
    set(
        action,
        "screenConfig.components.div.children.footer.children.editButton.visible",
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
    

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkApplicationStatus",
        {}
    );
    if (bookingStatus === "APPLIED") {
        await generageBillCollection(state, dispatch, applicationNumber, tenantId)
    } else {
        await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].businessService);
    }

    localStorageSet("bookingStatus", bookingStatus);
    HideshowFooter(action, bookingStatus);

    

    
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "cancelparkccbooking",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(
            window.location.href,
            "tenantId"
        );
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        // getPaymentGatwayList(action, state, dispatch).then(response => {
        // });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "PACC" },
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

                    },
                },

                body: getCommonCard({
                    estimateSummary: estimateSummary,
                    pccSummary: pccSummary,
                    confirmationStatement: confirmationStatement

                }),
                footer: footerForParkAndCC,
            }
        }
    }
};

export default screenConfig;
