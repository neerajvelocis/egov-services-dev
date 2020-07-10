import {
    getLabel,
    dispatchMultipleFieldChangeAction,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { download } from "egov-common/ui-utils/commons";
import {
    applyTradeLicense,
    getNextFinancialYearForRenewal,
} from "../../../../../ui-utils/commons";
import {
    getButtonVisibility,
    getCommonApplyFooter,
    setMultiOwnerForApply,
    setValidToFromVisibilityForApply,
    getDocList,
    setOwnerShipDropDownFieldChange,
    createEstimateData,
    validateFields,
    downloadAcknowledgementForm,
    downloadCertificateForm,
} from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
    toggleSnackbar,
    prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import set from "lodash/set";
import some from "lodash/some";

const moveToSuccess = (LicenseData, dispatch) => {
    const applicationNo = get(LicenseData, "applicationNumber");
    const tenantId = get(LicenseData, "tenantId");
    const financialYear = get(LicenseData, "financialYear");
    const purpose = "apply";
    const status = "success";
    dispatch(
        setRoute(
            `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
        )
    );
};
const editRenewalMoveToSuccess = (LicenseData, dispatch) => {
    const applicationNo = get(LicenseData, "applicationNumber");
    const tenantId = get(LicenseData, "tenantId");
    const financialYear = get(LicenseData, "financialYear");
    const licenseNumber = get(LicenseData, "licenseNumber");
    const purpose = "EDITRENEWAL";
    const status = "success";
    dispatch(
        setRoute(
            `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&licenseNumber=${licenseNumber}&FY=${financialYear}&tenantId=${tenantId}`
        )
    );
};

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

// export const footerReview = (
//     action,
//     state,
//     dispatch,
//     status,
//     applicationNumber,
//     tenantId,
//     financialYear
// ) => {
//     /** MenuButton data based on status */
//     let licenseNumber = get(
//         state.screenConfiguration.preparedFinalObject.Licenses[0],
//         "licenseNumber"
//     );
//     const responseLength = get(
//         state.screenConfiguration.preparedFinalObject,
//         `licenseCount`,
//         1
//     );

//     return getCommonApplyFooter({
//         container: {
//             uiFramework: "custom-atoms",
//             componentPath: "Container",
//             children: {
//                 rightdiv: {
//                     uiFramework: "custom-atoms",
//                     componentPath: "Div",
//                     props: {
//                         style: {
//                             float: "right",
//                             display: "flex",
//                         },
//                     },
//                     children: {
//                         resubmitButton: {
//                             componentPath: "Button",
//                             props: {
//                                 variant: "contained",
//                                 color: "primary",
//                                 style: {
//                                     minWidth: "180px",
//                                     height: "48px",
//                                     marginRight: "45px",
//                                 },
//                             },
//                             children: {
//                                 nextButtonLabel: getLabel({
//                                     labelName: "RESUBMIT",
//                                     labelKey: "TL_RESUBMIT",
//                                 }),
//                             },
//                             onClickDefination: {
//                                 action: "condition",
//                                 callBack: openPopup,
//                             },
//                             visible: getButtonVisibility(status, "RESUBMIT"),
//                             roleDefination: {
//                                 rolePath: "user-info.roles",
//                                 roles: ["TL_CEMP", "CITIZEN"],
//                             },
//                         },
//                         editButton: {
//                             componentPath: "Button",
//                             props: {
//                                 variant: "outlined",
//                                 color: "primary",
//                                 style: {
//                                     minWidth: "180px",
//                                     height: "48px",
//                                     marginRight: "16px",
//                                     borderRadius: "inherit",
//                                 },
//                             },
//                             children: {
//                                 previousButtonIcon: {
//                                     uiFramework: "custom-atoms",
//                                     componentPath: "Icon",
//                                     props: {
//                                         iconName: "keyboard_arrow_left",
//                                     },
//                                 },
//                                 previousButtonLabel: getLabel({
//                                     labelName: "Edit for Renewal",
//                                     labelKey: "TL_RENEWAL_BUTTON_EDIT",
//                                 }),
//                             },
//                             onClickDefination: {
//                                 action: "condition",
//                                 callBack: () => {
//                                     dispatch(
//                                         setRoute(
//                                             // `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
//                                             `/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
//                                         )
//                                     );
//                                 },
//                             },
//                             visible:
//                                 (getButtonVisibility(status, "APPROVED") ||
//                                     getButtonVisibility(status, "EXPIRED")) &&
//                                 responseLength === 1,
//                         },
//                         submitButton: {
//                             componentPath: "Button",
//                             props: {
//                                 variant: "contained",
//                                 color: "primary",
//                                 style: {
//                                     minWidth: "180px",
//                                     height: "48px",
//                                     marginRight: "45px",
//                                     borderRadius: "inherit",
//                                 },
//                             },
//                             children: {
//                                 nextButtonLabel: getLabel({
//                                     labelName: "Submit for Renewal",
//                                     labelKey: "TL_RENEWAL_BUTTON_SUBMIT",
//                                 }),
//                                 nextButtonIcon: {
//                                     uiFramework: "custom-atoms",
//                                     componentPath: "Icon",
//                                     props: {
//                                         iconName: "keyboard_arrow_right",
//                                     },
//                                 },
//                             },
//                             onClickDefination: {
//                                 action: "condition",
//                                 callBack: () => {
//                                     renewTradelicence(
//                                         financialYear,
//                                         state,
//                                         dispatch
//                                     );
//                                 },
//                             },
//                             visible:
//                                 (getButtonVisibility(status, "APPROVED") ||
//                                     getButtonVisibility(status, "EXPIRED")) &&
//                                 responseLength === 1,
//                         },
//                         makePayment: {
//                             componentPath: "Button",
//                             props: {
//                                 variant: "contained",
//                                 color: "primary",
//                                 style: {
//                                     minWidth: "180px",
//                                     height: "48px",
//                                     marginRight: "45px",
//                                     borderRadius: "inherit",
//                                 },
//                             },
//                             children: {
//                                 submitButtonLabel: getLabel({
//                                     labelName: "MAKE PAYMENT",
//                                     labelKey:
//                                         "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT",
//                                 }),
//                             },
//                             onClickDefination: {
//                                 action: "condition",
//                                 callBack: () => {
//                                     dispatch(
//                                         setRoute(
//                                             `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}`
//                                         )
//                                     );
//                                 },
//                             },
//                             visible:
//                                 process.env.REACT_APP_NAME === "Citizen" &&
//                                 getButtonVisibility(status, "PENDINGPAYMENT")
//                                     ? true
//                                     : false,
//                         },
//                     },
//                     gridDefination: {
//                         xs: 12,
//                         sm: 12,
//                     },
//                 },
//             },
//         },
//     });
// };
export const footerReviewTop = (
	action,
	state,
	dispatch,
	status,
	applicationNumber,
	tenantId,
  ) => {

	let downloadMenu = [];
	let printMenu = [];
	// let licenseNumber= get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
	// const responseLength = get(
	//   state.screenConfiguration.preparedFinalObject,
	//   `licenseCount`,
	//   1
	// );
  
	// const { Licenses } = state.screenConfiguration.preparedFinalObject;
  
	  // console.log(Licenses, "LicensesNew");
	// let renewalMenu=[];
	let certificateDownloadObject = {
	  label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
	  link: () => {
		const { Booking } = state.screenConfiguration.preparedFinalObject;
		downloadCertificateForm(Booking);
	  },
	  leftIcon: "book"
	};
	let certificatePrintObject = {
	  label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
	  link: () => {
		const { Booking } = state.screenConfiguration.preparedFinalObject;
		downloadCertificateForm(Booking,'print');
	  },
	  leftIcon: "book"
	};
  
	let receiptDownloadObject = {
	  label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
	  link: () => {
  
  
		// const receiptQueryString = [
		//   { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
		//   { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
		// ]
		// download(receiptQueryString);
		// generateReceipt(state, dispatch, "receipt_download");
	  },
	  leftIcon: "receipt"
	};
	let receiptPrintObject = {
	  label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
	  link: () => {
		// const receiptQueryString =  [
		//   { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
		//   { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
		// ]
		// download(receiptQueryString,"print");
	   // generateReceipt(state, dispatch, "receipt_print");
	  },
	  leftIcon: "receipt"
	};
	let applicationDownloadObject = {
	  label: { labelName: "Application", labelKey: "TL_APPLICATION" },
	  link: () => {
		// const { Licenses ,LicensesTemp} = state.screenConfiguration.preparedFinalObject;
		// const documents = LicensesTemp[0].reviewDocData;
		// set(Licenses[0],"additionalDetails.documents",documents)
		// downloadAcknowledgementForm(Licenses);
	  },
	  leftIcon: "assignment"
	};
	let applicationPrintObject = {
	  label: { labelName: "Application", labelKey: "TL_APPLICATION" },
	  link: () => {
		// const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
		// const documents = LicensesTemp[0].reviewDocData;
		// set(Licenses[0],"additionalDetails.documents",documents)
		// downloadAcknowledgementForm(Licenses,'print');
	  },
	  leftIcon: "assignment"
	};
	
	switch (status) {
	  case "APPROVED":
		downloadMenu = [
		  certificateDownloadObject,
		  receiptDownloadObject,
		  applicationDownloadObject
		];
		printMenu = [
		  certificatePrintObject,
		  receiptPrintObject,
		  applicationPrintObject
		];
		break;
	  case "PENDINGAPPROVAL":
	  case "PENDINGPAYMENT":
		downloadMenu = [applicationDownloadObject];
		printMenu = [applicationPrintObject];
		break;
	  case "REJECTED":
		downloadMenu = [applicationDownloadObject];
		printMenu = [applicationPrintObject];
		break;
	  default:
		break;
	}
	/** END */
  
	return {
	  rightdiv: {
		uiFramework: "custom-atoms",
		componentPath: "Div",
		props: {
		  style: { textAlign: "right", display: "flex" }
		},
		children: {
		  downloadMenu: {
			uiFramework: "custom-atoms-local",
			moduleName: "egov-services",
			componentPath: "MenuButton",
			props: {
			  data: {
				label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
				 leftIcon: "cloud_download",
				rightIcon: "arrow_drop_down",
				props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
				menu: downloadMenu
			  }
			}
		  },
		  printMenu: {
			uiFramework: "custom-atoms-local",
			moduleName: "egov-tradelicence",
			componentPath: "MenuButton",
			props: {
			  data: {
				label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
				leftIcon: "print",
				rightIcon: "arrow_drop_down",
				props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-print-button" },
				menu: printMenu
			  }
			}
		  }
  
		},
		// gridDefination: {
		//   xs: 12,
		//   sm: 6
		// }
	  } 
	}
	
  };
  

export const openPopup = (state, dispatch) => {
    dispatch(prepareFinalObject("ResubmitAction", true));
};

export const downloadPrintContainer = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId
) => {
    /** MenuButton data based on status */
    let downloadMenu = [];
    let printMenu = [];
    let tlCertificateDownloadObject = {
        label: { labelName: "Booking Certificate", labelKey: "BK_CERTIFICATE" },
        link: () => {
            const { Licenses } = state.screenConfiguration.preparedFinalObject;
            downloadCertificateForm(Licenses);
        },
        leftIcon: "book",
    };
    let tlCertificatePrintObject = {
        label: { labelName: "Booking Certificate", labelKey: "BK_CERTIFICATE" },
        link: () => {
            const { Licenses } = state.screenConfiguration.preparedFinalObject;
            downloadCertificateForm(Licenses, "print");
        },
        leftIcon: "book",
    };
    let receiptDownloadObject = {
        label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
        link: () => {
            const receiptQueryString = [
                {
                    key: "consumerCodes",
                    value: get(
                        state.screenConfiguration.preparedFinalObject
                            .Licenses[0],
                        "applicationNumber"
                    ),
                },
                {
                    key: "tenantId",
                    value: get(
                        state.screenConfiguration.preparedFinalObject
                            .Licenses[0],
                        "tenantId"
                    ),
                },
            ];
            download(receiptQueryString);
        },
        leftIcon: "receipt",
    };
    let receiptPrintObject = {
        label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
        link: () => {
            const receiptQueryString = [
                {
                    key: "consumerCodes",
                    value: get(
                        state.screenConfiguration.preparedFinalObject
                            .Licenses[0],
                        "applicationNumber"
                    ),
                },
                {
                    key: "tenantId",
                    value: get(
                        state.screenConfiguration.preparedFinalObject
                            .Licenses[0],
                        "tenantId"
                    ),
                },
            ];
            download(receiptQueryString, "print");
        },
        leftIcon: "receipt",
    };
    let applicationDownloadObject = {
        label: { labelName: "Application", labelKey: "TL_APPLICATION" },
        link: () => {
            const {
                Licenses,
                LicensesTemp,
            } = state.screenConfiguration.preparedFinalObject;
            const documents = LicensesTemp[0].reviewDocData;
            set(Licenses[0], "additionalDetails.documents", documents);
            downloadAcknowledgementForm(Licenses);
        },
        leftIcon: "assignment",
    };
    let applicationPrintObject = {
        label: { labelName: "Application", labelKey: "TL_APPLICATION" },
        link: () => {
            const {
                Licenses,
                LicensesTemp,
            } = state.screenConfiguration.preparedFinalObject;
            const documents = LicensesTemp[0].reviewDocData;
            set(Licenses[0], "additionalDetails.documents", documents);
            downloadAcknowledgementForm(Licenses, "print");
        },
        leftIcon: "assignment",
    };
    switch (status) {
        case "APPROVED":
            downloadMenu = [
                tlCertificateDownloadObject,
                receiptDownloadObject,
                applicationDownloadObject,
            ];
            printMenu = [
                tlCertificatePrintObject,
                receiptPrintObject,
                applicationPrintObject,
            ];
            break;
        case "APPLIED":
        case "CITIZENACTIONREQUIRED":
        case "FIELDINSPECTION":
        case "PENDINGAPPROVAL":
        case "PENDINGPAYMENT":
            downloadMenu = [applicationDownloadObject];
            printMenu = [applicationPrintObject];
            break;
        case "CANCELLED":
            downloadMenu = [applicationDownloadObject];
            printMenu = [applicationPrintObject];
            break;
        case "REJECTED":
            downloadMenu = [applicationDownloadObject];
            printMenu = [applicationPrintObject];
            break;
        default:
            break;
    }
    /** END */

    return {
        rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                style: { textAlign: "right", display: "flex" },
            },
            children: {
                downloadMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-tradelicence",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: {
                                labelName: "DOWNLOAD",
                                labelKey: "TL_DOWNLOAD",
                            },
                            leftIcon: "cloud_download",
                            rightIcon: "arrow_drop_down",
                            props: {
                                variant: "outlined",
                                style: { height: "60px", color: "#FE7A51" },
                                className: "tl-download-button",
                            },
                            menu: downloadMenu,
                        },
                    },
                },
                printMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-tradelicence",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: { labelName: "PRINT", labelKey: "TL_PRINT" },
                            leftIcon: "print",
                            rightIcon: "arrow_drop_down",
                            props: {
                                variant: "outlined",
                                style: { height: "60px", color: "#FE7A51" },
                                className: "tl-print-button",
                            },
                            menu: printMenu,
                        },
                    },
                },
            },
            // gridDefination: {
            //   xs: 12,
            //   sm: 6
            // }
        },
    };
};
