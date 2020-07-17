import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { furnishNocResponse, getSearchResults } from "../../../../../ui-utils/commons";

export const nocDetail = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Booking Details",
            labelKey: "BK_WTB_DETAILS_HEADER",
        },
        {
            style: {
                marginBottom: 10,
            },
        }
    ),
    break: getBreak(),
    nocDetailContainer: getCommonContainer({
        // applicantName: {
        //     ...getTextField({
        //         label: {
        //             labelName: "Applicant Name",
        //             labelKey: "BK_WTB_NAME_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Enter Applicant Name",
        //             labelKey: "BK_WTB_NAME_PLACEHOLDER",
        //         },
        //         required: true,
        //         pattern: getPattern("Name"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "SELLMEATNOC.applicantName",
        //     }),
        // },
        houseNumber: {
            ...getTextField({
                label: {
                    labelName: "House/Site No.",
                    labelKey: "BK_WTB_HOUSE_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "BK_WTB_HOUSE_NUMBER_PLACEHOLDER",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "SELLMEATNOC.houseNo",
            }),
        },
        completeAddress: {
            ...getTextField({
                label: {
                    labelName: "Complete Address",
                    labelKey: "BK_WTB_COMPLETE_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Complete Address",
                    labelKey: "BK_WTB_COMPLETE_ADDRESS_PLACEHOLDER",
                },
                // pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "SELLMEATNOC.completeAddress",
            }),
        },
        Sector: {
            ...getSelectField({
                label: { labelName: "Sector", labelKey: "BK_WTB_PROPERTY_SECTOR_LABEL" },
                // localePrefix: {
                //   moduleName: "egpm",
                //   masterName: "sector"
                // },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Sector",
                    labelKey: "BK_WTB_PROPERTY_SECTOR_LABEL",
                },
                //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                jsonPath: "SELLMEATNOC.sector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        // City: {
        //     ...getSelectField({
        //         label: {
        //             labelName: "Village/City",
        //             labelKey: "BK_WTB_CITY_LABEL",
        //         },
        //         // localePrefix: {
        //         //   moduleName: "egpm",
        //         //   masterName: "sector"
        //         // },
        //         optionLabel: "name",
        //         placeholder: {
        //             labelName: "Select Village/City",
        //             labelKey: "BK_WTB_CITY_LABEL",
        //         },
        //         //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        //         sourceJsonPath: "applyScreenMdmsData.egpm.city",
        //         jsonPath: "SELLMEATNOC.city",
        //         // required: true,
        //         props: {
        //             className: "applicant-details-error",
        //             //   required: true,
        //             // disabled: true
        //         },
        //     }),
        // },
        propertyType: {
            ...getSelectField({
                label: {
                    labelName: "Residential/Commercial",
                    labelKey: "BK_WTB_PROPERTY_TYPE_LABEL",
                },
                // localePrefix: {
                //   moduleName: "egpm",
                //   masterName: "sector"
                // },
                // optionLabel: "name",
                placeholder: {
                    labelName: "Select Residential/Commercial",
                    labelKey: "BK_WTB_PROPERTY_TYPE_LABEL",
                },
                //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                sourceJsonPath: "applyScreenMdmsData.egpm.propertyType",
                jsonPath: "SELLMEATNOC.propertyType",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        storageArea: {
            ...getSelectField({
                label: {
                    labelName: "Storage Area",
                    labelKey: "BK_WTB_STORAGE_AREA_LABEL",
                },
                // localePrefix: {
                //   moduleName: "egpm",
                //   masterName: "sector"
                // },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Storage Area",
                    labelKey: "BK_WTB_STORAGE_AREA_LABEL",
                },
                //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                sourceJsonPath: "applyScreenMdmsData.egpm.storageArea",
                jsonPath: "SELLMEATNOC.storageArea",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        Duration: {
            ...getSelectField({
                label: {
                    labelName: "Duration",
                    labelKey: "BK_WTB_DURATION_LABEL",
                },
                // localePrefix: {
                //   moduleName: "egpm",
                //   masterName: "sector"
                // },
                optionLabel: "name",
                placeholder: {
                    labelName: "Select Duration",
                    labelKey: "BK_WTB_DURATION_LABEL",
                },
                //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
                sourceJsonPath: "applyScreenMdmsData.egpm.duration",
                jsonPath: "SELLMEATNOC.duration",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        // Category: {
        //     ...getSelectField({
        //         label: {
        //             labelName: "Category",
        //             labelKey: "BK_WTB_CATEGORY_LABEL",
        //         },
        //         // localePrefix: {
        //         //   moduleName: "egpm",
        //         //   masterName: "sector"
        //         // },
        //         optionLabel: "name",
        //         placeholder: {
        //             labelName: "Select Category",
        //             labelKey: "BK_WTB_CATEGORY_LABEL",
        //         },
        //         //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        //         sourceJsonPath: "applyScreenMdmsData.egpm.category",
        //         jsonPath: "SELLMEATNOC.category",
        //         required: true,
        //         props: {
        //             className: "applicant-details-error",
        //             required: true,
        //             // disabled: true
        //         },
        //     }),
        // },
        // Email: {
        //     ...getTextField({
        //         label: {
        //             labelName: "Email Address",
        //             labelKey: "BK_WTB_EMAIL_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Enter Email Address",
        //             labelKey: "BK_WTB_EMAIL_PLACEHOLDER",
        //         },
        //         required: true,
        //         pattern: getPattern("Email"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "SELLMEATNOC.emailId",
        //     }),
        // },
        // Mobile: {
        //     ...getTextField({
        //         label: {
        //             labelName: "Contact Number",
        //             labelKey: "BK_WTB_MOBILE_NO_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Enter Contact Number",
        //             labelKey: "BK_WTB_MOBILE_NO_PLACEHOLDER",
        //         },
        //         required: true,
        //         pattern: getPattern("MobileNo"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         jsonPath: "SELLMEATNOC.mobileNumber",
        //     }),
        // },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            props: {
                disabled: true,
            },
        },
    }),
});

