import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import {
    getCurrentFinancialYear,
    generateBill,
} from "../utils";
import estimateDetails from "./payResource/estimate-details";
import { footer, callPGService } from "./payResource/footer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getPaymentGateways,
    getSearchResultsView,
} from "../../../../ui-utils/commons";

import { getapplicationType, setapplicationType, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Application for ${
            getapplicationType() === "OSBM"
                ? "Open Space to Store Building Material"
                : getapplicationType() === "GFCP"
                ? "Commercial Ground"
                : getapplicationType() === "OSUJM" ? "Open Space within MCC jurisdiction" :  "Water Tanker"
        } (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
        // labelName: `Application for ${getapplicationType() === "OSBM" ? "Open Space to Store Building Material" : "Water Tanker"}` //later use getFinancialYearDates
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getQueryArg(window.location.href, "applicationNumber"),
        },
    },
});

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

    await generateBill(
        state,
        dispatch,
        applicationNumber,
        tenantId,
        recData[0].businessService
    );
};

const setPaymentMethods = async (action, state, dispatch) => {
    const response = await getPaymentGateways();
    if (!!response.length) {
        const paymentMethods = response.map((item) => ({
            label: {
                labelName: item,
                labelKey: item,
            },
            link: () => callPGService(state, dispatch, item),
        }));
        set(
            action,
            "screenConfig.components.div.children.footer.children.makePayment.props.data.menu",
            paymentMethods
        );
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "pay",
    beforeInitScreen: (action, state, dispatch) => {
        let applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setapplicationType(businessService);
        setPaymentMethods(action, state, dispatch);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "pay",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 12,
                            },
                            ...header,
                        },
                    },
                },
                formwizardFirstStep: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    children: {
                        paymentDetails: getCommonCard({
                            header: getCommonTitle({
                                labelName: "Payment Collection Details",
                                labelKey: "BK_PAYMENT_HEADER",
                            }),
                            estimateDetails,
                        }),
                    },
                },
                footer,
            },
        },
    },
};

export default screenConfig;
