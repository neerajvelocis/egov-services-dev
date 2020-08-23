import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceParkCommunityCenter/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceParkCommunityCenter/nocDetails";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceParkCommunityCenter/documentDetails";
import { summaryDetails } from "./applyResourceParkCommunityCenter/summaryDetails";
import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
    setapplicationNumber,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import {
    sampleSearch,
    sampleSingleSearch,
    sampleDocUpload,
} from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import get from "lodash/get";

import {
    prepareDocumentsUploadData,
    getSearchResults,
    getSearchResultsView,
    setApplicationNumberBox,
    furnishOsbmResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_PCC_APPLICANT_DETAILS" },
    { labelName: "Booking Details", labelKey: "BK_PCC_BOOKING_DETAILS" },
    { labelName: "Documents", labelKey: "BK_PCC_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_PCC_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);

// const applicationNumberContainer = () => {
//     const applicationNumber = getQueryArg(
//         window.location.href,
//         "applicationNumber"
//     );
//     if (applicationNumber)
//         return {
//             uiFramework: "custom-atoms-local",
//             moduleName: "egov-services",
//             componentPath: "ApplicationNoContainer",
//             props: {
//                 number: `${applicationNumber}`,
//                 visibility: "hidden",
//             },
//             visible: true,
//         };
//     else return {};
// };

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Parks & Community Center/Banquet Halls`,
        labelKey: "BK_PCC_APPLY",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: false,
    },
});

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        personalDetails,
    },
};

export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form2",
    },
    children: {
        bookingDetails,
    },
    visible: false,
};

export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form3",
    },
    children: {
        documentDetails,
    },
    visible: false,
};

export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form4",
    },
    children: {
        summaryDetails,
    },
    visible: false,
};

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
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
                            name: "VillageCity",
                        },
                        {
                            name: "Type_of_Construction",
                        },
                        {
                            name: "Documents",
                        },
                    ],
                },
            ],
        },
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        payload.MdmsRes.PCC_Document = [{
                active: true,
                code: "PCC_DOCUMENT",
                description: "PCC_DOCUMENT_DESCRIPTION",
                documentType: "DOC",
                dropdownData: [],
                hasDropdown: false,
                required: false,
        }]
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

export const prepareEditFlow = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    if (applicationNumber) {
        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);

        // let Refurbishresponse = furnishOsbmResponse(response);
        dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));

        let fileStoreIds = Object.keys(response.documentMap);
        let fileStoreIdsValue = Object.values(response.documentMap);
        let fileUrls =
            fileStoreIds.length > 0
                ? await getFileUrlFromAPI(fileStoreIds)
                : {};
        dispatch(prepareFinalObject("documentsUploadReduxOld.documents", [
			{
				fileName: fileStoreIdsValue[0],
				fileStoreId: fileStoreIds[0],
				fileUrl: fileUrls[fileStoreIds[0]],
			},
		]));
		console.log("hereitis")
		// prepareFinalObject("documentsUploadRedux", {
		// 	0: {
		// 	  documents: [
		// 		{
		// 			fileName: fileStoreIdsValue[0],
		// 			fileStoreId: fileStoreIds[0],
		// 			fileUrl: fileUrls[fileStoreIds[0]],
		// 		},
		// 	  ]
		// 	}
		//   });
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applyparkcommunitycenter",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType("OSBM");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
		);
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");
        dispatch(
            prepareFinalObject(
                "Booking.bkApplicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            dispatch(
                prepareFinalObject(
                    "Booking.bkMobileNumber",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );
        // dispatch(prepareFinalObject("Booking.bkEmail", "HELLO@GMAIL.COM"));
        // dispatch(prepareFinalObject("Booking.bkHouseNo", "2"));
        // dispatch(prepareFinalObject("Booking.bkCompleteAddress", "hello address"));
        // dispatch(prepareFinalObject("Booking.bkSector", "SECTOR-2"));
        // dispatch(prepareFinalObject("Booking.bkType", "Residential"));
        // dispatch(prepareFinalObject("Booking.bkAreaRequired", "Less than 1000 sqft"));
        // dispatch(prepareFinalObject("Booking.bkDuration", "2"));
        // dispatch(prepareFinalObject("Booking.bkCategory", "Cat-A"));
        // dispatch(prepareFinalObject("Booking.bkVillCity", "City"));
        // dispatch(prepareFinalObject("Booking.bkConstructionType", "New"));
        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {
            prepareDocumentsUploadData(state, dispatch, "apply_osbm");
        });

		// Search in case of EDIT flow
        if (applicationNumber !== null ) {
			set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(state, dispatch, applicationNumber, tenantId);
        }

        // Code to goto a specific step through URL
        if (step && step.match(/^\d+$/)) {
            let intStep = parseInt(step);
            set(
                action.screenConfig,
                "components.div.children.stepper.props.activeStep",
                intStep
            );
            let formWizardNames = [
                "formwizardFirstStep",
                "formwizardSecondStep",
                "formwizardThirdStep",
                "formwizardFourthStep",
            ];
            for (let i = 0; i < 4; i++) {
                set(
                    action.screenConfig,
                    `components.div.children.${formWizardNames[i]}.visible`,
                    i == step
                );
                set(
                    action.screenConfig,
                    `components.div.children.footer.children.previousButton.visible`,
                    step != 0
                );
            }
        }

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
                                sm: 10,
                            },
                            ...header,
                        },
                    },
                },
                stepper,
                formwizardFirstStep,
                formwizardSecondStep,
                formwizardThirdStep,
                formwizardFourthStep,
                footer,
            },
        },
    },
};

export default screenConfig;
