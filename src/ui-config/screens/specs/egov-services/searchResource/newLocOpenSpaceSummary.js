import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const openSpaceSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Applicant Details",
                    labelKey: "MY_BK_APPLICATION_DETAILS_HEADER",
                }),
            },

        },
    },
    cardOne: {
        uiFramework: "custom-containers-local",
        componentPath: "MultiItemsWithImageContainer",
        moduleName: "egov-services",
        props: {
            contents: [
                {
                    label: "MY_BK_APPLICATION_NUMBER_LABEL",
                    jsonPath: "applicationNumber",
                },
                {
                    label: "MY_BK_APPLICATION_STATUS_LABEL",
                    jsonPath: "applicationStatus",
                },
                {
                    label: "MY_BK_COMPLETE_ADDRESS_LABEL",
                    jsonPath: "localityAddress",
                },
                {
                    label: "MY_BK_PROPERTY_SECTOR_LABEL",
                    jsonPath: "sector",
                },
                {
                    label: "MY_BK_STORAGE_AREA_LABEL",
                    jsonPath: "areaRequirement",
                }
            ],
            moduleName: "egov-services",
        },
        type: "array",

    },
});
