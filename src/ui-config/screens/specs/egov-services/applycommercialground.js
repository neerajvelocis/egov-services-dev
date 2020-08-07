import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
    convertDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceCommercialGround/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceCommercialGround/nocDetails";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceCommercialGround/documentDetails";
import { summaryDetails } from "./applyResourceCommercialGround/summaryDetails";
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
    furnishNocResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_CGB_APPLICANT_DETAILS" },
    { labelName: "Booking Details", labelKey: "BK_CGB_BOOKING_DETAILS" },
    { labelName: "Documents", labelKey: "BK_CGB_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_CGB_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);

const applicationNumberContainer = () => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    if (applicationNumber)
        return {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-services",
            componentPath: "ApplicationNoContainer",
            props: {
                number: `${applicationNumber}`,
                visibility: "hidden",
            },
            visible: true,
        };
    else return {};
};

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Commercial Ground`,
        labelKey: "BK_CGB_APPLY",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "applicationNumberContainer",
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
        summaryDetails
    },
    visible: false,
};

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    console.log(tenantId, "tenantId")
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
                        {
                            name: "Purpose"
                        },
                        {
                            name: "BookingVenue"
                        },

                    ],
                }

            ]
        }
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
        ///company///municipal corporation)
        payload.MdmsRes.BookingVenue = [
            { id: 1, code: 'Sector 17', tenantId: 'ch.chandigarh', name: 'Sector 17', active: true },
            { id: 2, code: 'Sector 34', tenantId: 'ch.chandigarh', name: 'Sector 34', active: true },
            { id: 2, code: 'Manimajra', tenantId: 'ch.chandigarh', name: 'Manimajra', active: true }
        ]
        payload.MdmsRes.Category = [
            { id: 1, code: 'INDIVIDUAL', tenantId: 'ch.chandigarh', name: 'INDIVIDUAL', active: true },
            { id: 1, code: 'corporate', tenantId: 'ch.chandigarh', name: 'corporate', active: true },
            { id: 1, code: 'Society', tenantId: 'ch.chandigarh', name: 'Society', active: true },
            { id: 1, code: 'company', tenantId: 'ch.chandigarh', name: 'company', active: true },
            { id: 1, code: 'Government', tenantId: 'ch.chandigarh', name: 'Government', active: true },
            { id: 1, code: 'semi government', tenantId: 'ch.chandigarh', name: 'semi government', active: true },
            { id: 2, code: 'municipal corporation', tenantId: 'ch.chandigarh', name: 'municipal corporation', active: true }
        ]
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

        let Refurbishresponse = furnishNocResponse(response);
        dispatch(prepareFinalObject("Booking", Refurbishresponse));
        if (applicationNumber) {
            setapplicationNumber(applicationNumber);
            setApplicationNumberBox(state, dispatch, applicationNumber);
        }

        // Set sample docs upload
        // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
        let documentsPreview = [];

        // Get all documents from response
        let petnocdetails = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            {}
        );
        let uploadVaccinationCertificate = petnocdetails.hasOwnProperty(
            "uploadVaccinationCertificate"
        )
            ? petnocdetails.uploadVaccinationCertificate[0]["fileStoreId"]
            : "";

        let uploadPetPicture = petnocdetails.hasOwnProperty("uploadPetPicture")
            ? petnocdetails.uploadPetPicture[0]["fileStoreId"]
            : "";

        if (uploadVaccinationCertificate !== "" && uploadPetPicture !== "") {
            documentsPreview.push(
                {
                    title: "VACCINATION_CERTIFIACTE",
                    fileStoreId: uploadVaccinationCertificate,
                    linkText: "View",
                },
                {
                    title: "PET_PICTURE",
                    fileStoreId: uploadPetPicture,
                    linkText: "View",
                }
            );
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
                fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
            documentsPreview = documentsPreview.map(function (doc, index) {
                doc["link"] =
                    (fileUrls &&
                        fileUrls[doc.fileStoreId] &&
                        fileUrls[doc.fileStoreId].split(",")[0]) ||
                    "";
                //doc["name"] = doc.fileStoreId;
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
    }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applycommercialground",
    beforeInitScreen: (action, state, dispatch) => {
        clearlocalstorageAppDetails(state);
        setapplicationType('CGB');

        const tenantId = getQueryArg(window.location.href, "tenantId");
        const venueData = getQueryArg(window.location.href, "venue");

        const queryfrom = getQueryArg(window.location.href, "from");
        const queryto = getQueryArg(window.location.href, "to");
        const from = convertDateInYMD(queryfrom)
        const to = convertDateInYMD(queryto)


        dispatch(prepareFinalObject("Booking.bkFromDate", from));
        dispatch(prepareFinalObject("Booking.bkToDate", to));

        dispatch(prepareFinalObject("Booking.bkBookingVenue", venueData));
        dispatch(prepareFinalObject("Booking.bkSector", venueData));




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
            prepareDocumentsUploadData(state, dispatch, "apply_cgb");
        });

        // Search in case of EDIT flow
        // prepareEditFlow(state, dispatch, applicationNumber, tenantId);

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
