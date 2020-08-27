import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter,showHideAdhocPopup } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get"


export const callBackForPrevious = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};

export const callBackForNext = (state, dispatch, pathKey) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService =  get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    dispatch(
        setRoute(
            `/egov-services/pay?applicationNumber=${applicationNumber}&tenantId=${
                getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};

export const footer = getCommonApplyFooter({
    cancelButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {
            // previousButtonIcon: {
            //     uiFramework: "custom-atoms",
            //     componentPath: "Icon",
            //     props: {
            //         iconName: "keyboard_arrow_left",
            //     },
            // },
            previousButtonLabel: getLabel({
                labelName: "CANCEL",
                labelKey: "MY_BK_BUTTON_CANCEL",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForPrevious,
        },
        visible: false
    },

    submitButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "45px",
                borderRadius: "inherit",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "Make Payment",
                labelKey: "MY_BK_BUTTON_PAYMENT",
            }),
            // nextButtonIcon: {
            //     uiFramework: "custom-atoms",
            //     componentPath: "Icon",
            //     props: {
            //         iconName: "keyboard_arrow_right",
            //     },
            // },
        },
        onClickDefination: {
            action: "condition",
            // callBack: callBackForNext,
              callBack: (state, dispatch) =>
                callBackForNext(state, dispatch, "pay"),
        },
        visible: false
        // roleDefination: {
        //     rolePath: "user-info.roles",
        //     roles: ["CITIZEN"],
        //     action: "PAY",
        // },
    },
});