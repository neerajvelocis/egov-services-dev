import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter,showHideAdhocPopup } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
import generateReceipt from "../../utils/receiptPdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const generatePdfFromDiv = (action, applicationNumber) => {
    let target = document.querySelector("#custom-atoms-div");
    html2canvas(target, {
        onclone: function (clonedDoc) {
            // clonedDoc.getElementById("custom-atoms-footer")[
            //   "data-html2canvas-ignore"
            // ] = "true";
            clonedDoc.getElementById("custom-atoms-footer").style.display =
                "none";
        },
    }).then((canvas) => {
        var data = canvas.toDataURL("image/jpeg", 1);
        var imgWidth = 200;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF("p", "mm");
        var position = 0;

        doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        if (action === "download") {
            doc.save(`preview-${applicationNumber}.pdf`);
        } else if (action === "print") {
            doc.autoPrint();
            window.open(doc.output("bloburl"), "_blank");
        }
    });
};

export const callBackForPrevious = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};

export const callBackForNext = (state, dispatch, pathKey) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    dispatch(
        setRoute(
            `/egov-services/pay?applicationNumber=${applicationNumber}&tenantId=${
                getTenantId().split(".")[0]
            }`
        )
    );
};
// export const callBackForNextOpms = (state, dispatch, pathKey) => {
//     const applicationNumber = getQueryArg(
//         window.location.href,
//         "applicationNumber"
//     );
//     dispatch(
//         setRoute(
//             `/egov-services/opms-pay?applicationNumber=${applicationNumber}&tenantId=${
//                 getTenantId().split(".")[0]
//             }`
//         )
//     );
// };
// export const callBackForNextWtb = (state, dispatch, pathKey) => {
//     const applicationNumber = getQueryArg(
//         window.location.href,
//         "applicationNumber"
//     );
//     dispatch(
//         setRoute(
//             `/egov-services/wtb-pay?applicationNumber=${applicationNumber}&tenantId=${
//                 getTenantId().split(".")[0]
//             }`
//         )
//     );
// }

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
// export const opmsFooter = getCommonApplyFooter({
//     cancelButton: {
//         componentPath: "Button",
//         props: {
//             variant: "outlined",
//             color: "primary",
//             style: {
//                 minWidth: "180px",
//                 height: "48px",
//                 marginRight: "16px",
//                 borderRadius: "inherit",
//             },
//         },
//         children: {
//             // previousButtonIcon: {
//             //     uiFramework: "custom-atoms",
//             //     componentPath: "Icon",
//             //     props: {
//             //         iconName: "keyboard_arrow_left",
//             //     },
//             // },
//             previousButtonLabel: getLabel({
//                 labelName: "CANCEL",
//                 labelKey: "MY_BK_BUTTON_CANCEL",
//             }),
//         },
//         onClickDefination: {
//             action: "condition",
//             callBack: callBackForPrevious,
//         },
//         visible: false
//     },

//     submitButton: {
//         componentPath: "Button",
//         props: {
//             variant: "contained",
//             color: "primary",
//             style: {
//                 minWidth: "180px",
//                 height: "48px",
//                 marginRight: "45px",
//                 borderRadius: "inherit",
//             },
//         },
//         children: {
//             nextButtonLabel: getLabel({
//                 labelName: "Make Payment",
//                 labelKey: "MY_BK_BUTTON_PAYMENT",
//             }),
//         },
//         onClickDefination: {
//             action: "condition",
//             callBack: callBackForNextOpms,
//         },
//     },
// });
// export const wtbFooter = getCommonApplyFooter({
//     cancelButton: {
//         componentPath: "Button",
//         props: {
//             variant: "outlined",
//             color: "primary",
//             style: {
//                 minWidth: "180px",
//                 height: "48px",
//                 marginRight: "16px",
//                 borderRadius: "inherit",
//             },
//         },
//         children: {
//             // previousButtonIcon: {
//             //     uiFramework: "custom-atoms",
//             //     componentPath: "Icon",
//             //     props: {
//             //         iconName: "keyboard_arrow_left",
//             //     },
//             // },
//             previousButtonLabel: getLabel({
//                 labelName: "CANCEL",
//                 labelKey: "MY_BK_BUTTON_CANCEL",
//             }),
//         },
//         onClickDefination: {
//             action: "condition",
//             callBack: callBackForPrevious,
//         },
//         visible: false
//     },

//     submitButton: {
//         componentPath: "Button",
//         props: {
//             variant: "contained",
//             color: "primary",
//             style: {
//                 minWidth: "180px",
//                 height: "48px",
//                 marginRight: "45px",
//                 borderRadius: "inherit",
//             },
//         },
//         children: {
//             nextButtonLabel: getLabel({
//                 labelName: "Make Payment",
//                 labelKey: "MY_BK_BUTTON_PAYMENT",
//             }),
//         },
//         onClickDefination: {
//             action: "condition",
//             callBack: callBackForNextWtb,
//         },
//     },
// });
