import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceOSWMCC/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceOSWMCC/nocDetails";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceOSWMCC/documentDetails";
import { summaryDetails } from "./applyResourceOSWMCC/summaryDetails";
//import { documentDetailsImagesNewLoc } from "./applyResourceOSWMCC/documentDetailsImagesNewLoc";

import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage,
    decodeURIComponent
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
    getNewLocationsSearchResults,
    setApplicationNumberBox,
    furnishOsbmResponse,
    getSearchResultsViewForNewLocOswmcc
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_OSWMCC_NEW_LOC_APPLICANT_DETAILS" },
    { labelName: "New Location Details", labelKey: "BK_OSWMCC_NEW_LOC_DETAILS" },
    { labelName: "Documents", labelKey: "BK_OSWMCC_NEW_LOC_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_OSWMCC_NEW_LOC_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);


export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for new location within MCC`,
        labelKey: "BK_OSWMCC_NEW_LOC_APPLY",
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
        documentDetails
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
                        // {
                        //     name: "OSWMCC_New_Loc_Documents",
                        // },
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

        payload.MdmsRes.Booking.OSWMCC_New_Loc_Documents = [{
            active: true,
            code: "OSWMCC_ID_PROOF",
            description: "OSWMCC_DOCUMENT_ID_PROOF_DESCRIPTION",
            documentType: "IDPROOF",
            dropdownData: [],
            hasDropdown: false,
            required: false,
        }, {
            active: true,
            code: "OSWMCC_LOCATION_IMAGE_1",
            description: "OSWMCC_DOCUMENT_LOCATION_DESCRIPTION",
            documentType: "MCCNEWLOCATION",
            dropdownData: [],
            hasDropdown: false,
            required: false,
        }, {
            active: true,
            code: "OSWMCC_LOCATION_IMAGE_2",
            description: "OSWMCC_DOCUMENT_LOCATION_DESCRIPTION",
            documentType: "MCCNEWLOCATION",
            dropdownData: [],
            hasDropdown: false,
            required: false,
        }, {
            active: true,
            code: "OSWMCC_LOCATION_IMAGE_3",
            description: "OSWMCC_DOCUMENT_LOCATION_DESCRIPTION",
            documentType: "MCCNEWLOCATION",
            dropdownData: [],
            hasDropdown: false,
            required: false,
        }];
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
        let response = await getSearchResultsViewForNewLocOswmcc([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);

        // let Refurbishresponse = furnishOsbmResponse(response);
        dispatch(prepareFinalObject("Booking", response.osujmNewLocationModelList[0]));

        let fileStoreIdsArray = Object.keys(response.documentMap);
        let fileStoreIds = fileStoreIdsArray.join();
        //let onlyLocationImages = Object.values(response.documentMap);
        // console.log(fileStoreIds, "Nero File Keys");
        // console.log(fileStoreIdsValue, "Nero File Values");
        // let fileUrls =
        //     fileStoreIds.length > 0
        //         ? await getFileUrlFromAPI(fileStoreIds)
        //         : {};

        let onlyLocationImages = Object.entries(response.documentMap);
        // console.log(fileEntriesArray, "File Entries");
        //let imagesAndPdfs = [];
        // for (let i = 0; i < fileEntriesArray.length; i++) {
        /* let fileLinks = getFileUrlFromAPI([fileEntriesArray[i][0]])
             .then(
                 (results) => {
                     console.log(Object.values(results), "Nero Array");
                     return Object.values(results)[0];
                 }
             );
         console.log(fileLinks, "File Links");
         imagesAndPdfs.push({
             fileUrl: fileLinks,
             fileName: fileEntriesArray[i][1],
             fileStoreId: fileEntriesArray[i][0]
         }
         )
         */

        // let fileStoreIds = onlyLocationImages && onlyLocationImages
        //     .map((item) => item.fileStoreId)
        //     .join(",");

        const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
        let newLocationImagesPreview = [];
        onlyLocationImages && onlyLocationImages.forEach((item, index) => {
            newLocationImagesPreview[index] = {
                fileName:item[1] ||
                    `Document - ${index + 1}`,
                fileStoreId: item[0],
                fileUrl: Object.values(fileUrlPayload)[
                    index
                ],
                title: item.documentType,
                
            };
        });

        dispatch(prepareFinalObject("documentsUploadReduxOld.documents", newLocationImagesPreview));
      
        console.log("hereitis")


    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applyNewLocationUnderMCC",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType("NLUJM");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");
        dispatch(
            prepareFinalObject(
                "Booking.applicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            dispatch(
                prepareFinalObject(
                    "Booking.contact",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );

        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {
            prepareDocumentsUploadData(state, dispatch, "apply_oswmcc_newloc");
        });

        // Search in case of EDIT flow
        if (applicationNumber !== null) {
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
