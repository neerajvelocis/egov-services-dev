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

export const openSpaceApplicationSummary = getCommonGrayCard({
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
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicantContainer: getCommonContainer({
                    applicantName: getLabelWithValue(
                        {
                            labelName: "Name",
                            labelKey: "MY_BK_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkApplicantName",
                        }
                    ),
                    applicantEmail: getLabelWithValue(
                        {
                            labelName: "Email Address",
                            labelKey: "MY_BK_EMAIL_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkEmail",
                        }
                    ),
                    applicantMobile: getLabelWithValue(
                        {
                            labelName: "Mobile Number",
                            labelKey: "MY_BK_MOBILE_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkMobileNumber",
                        }
                    ),
                    HouseNo: getLabelWithValue(
                        {
                            labelName: "House No.",
                            labelKey: "MY_BK_HOUSE_NO_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkHouseNo",
                        }
                    ),
                    CompleteAddress: getLabelWithValue(
                        {
                            labelName: "House No.",
                            labelKey: "MY_BK_COMPLETE_ADDRESS_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCompleteAddress",
                        }
                    ),
                    Sector: getLabelWithValue(
                        {
                            labelName: "Sector",
                            labelKey: "MY_BK_PROPERTY_SECTOR_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSector",
                        }
                    ),
                    PropertyType: getLabelWithValue(
                        {
                            labelName: "Residential/Commercial",
                            labelKey: "MY_BK_PROPERTY_TYPE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkType",
                        }
                    ),
                    StorageArea: getLabelWithValue(
                        {
                            labelName: "Storage Area",
                            labelKey: "MY_BK_STORAGE_AREA_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkAreaRequired",
                        }
                    ),
                    DurationLabel: getLabelWithValue(
                        {
                            labelName: "Duration",
                            labelKey: "MY_BK_DURATION_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkDuration",
                        }
                    ),
                    Category: getLabelWithValue(
                        {
                            labelName: "Category",
                            labelKey: "MY_BK_CATEGORY_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCategory",
                        }
                    ),
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
            prefixSourceJsonPath:
                "children.cardContent.children.applicantContainer.children",
            afterPrefixJsonPath: "children.value.children.key",
        },
        type: "array",
    },
});
