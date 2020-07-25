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
                    labelKey: "BK_OSB_APPLICATION_DETAILS_HEADER",
                }),
            },
            // editSection: {
            //   componentPath: "Button",
            //   props: {
            //     color: "primary",
            //     style: {
            //       marginTop: "-10px",
            //       marginRight: "-18px",
            //     },
            //   },
            //   gridDefination: {
            //     xs: 4,
            //     align: "right",
            //   },
            //   children: {
            //     editIcon: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "edit",
            //       },
            //     },
            //     buttonLabel: getLabel({
            //       labelName: "Edit",
            //       labelKey: "NOC_SUMMARY_EDIT",
            //     }),
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       gotoApplyWithStep(state, dispatch, 0);
            //     },
            //   },
            // },
        },
    },
    cardOne: {
        uiFramework: "custom-containers-local",
        componentPath: "MultiItemsWithImageContainer",
        moduleName : "egov-services",
        props : {
            contents: [
                {
                  label: "MY_BK_APPLICATION_NUMBER_LABEL",
                  jsonPath: "bkApplicationNumber"
                }, 
                {
                  label: "MY_BK_APPLICATION_STATUS_LABEL",
                  jsonPath: "bkApplicationStatus"
                },
                {
                  label: "MY_BK_HOUSE_NO_LABEL",
                  jsonPath: "bkHouseNo"
                },              {
                  label: "MY_BK_COMPLETE_ADDRESS_LABEL",
                  jsonPath: "bkCompleteAddress"
                },
                {
                  label: "MY_BK_PROPERTY_SECTOR_LABEL",
                  jsonPath: "bkSector",
                },
                {
                  label: "MY_BK_PROPERTY_TYPE_LABEL",
                  jsonPath: "bkType",
                },
                {
                  label: "MY_BK_STORAGE_AREA_LABEL",
                  jsonPath: "bkAreaRequired",
                },               
                {
                  label: "MY_BK_CITY_LABEL",
                  jsonPath: "bkVillCity",
                },
                {
                  label: "MY_BK_CONSTRUCTION_TYPE_LABEL",
                  jsonPath: "bkConstructionType",
                },
                {
                  label: "MY_BK_CATEGORY_LABEL",
                  jsonPath: "bkCategory",
                }
              ],
              moduleName: "egov-services",
        },
        type: "array",
    },
});
