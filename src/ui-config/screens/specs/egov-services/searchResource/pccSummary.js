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

export const pccSummary = getCommonGrayCard({
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
                    labelKey: "BK_CGB_APPLICATION_DETAILS_HEADER",
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
            //       labelKey: "BK_SUMMARY_EDIT",
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
                applicationContainer: getCommonContainer({
                    HouseNo: getLabelWithValue(
                        {
                            labelName: "House No.",
                            labelKey: "BK_PCC_HOUSE_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkHouseNo",
                        }
                    ),
                    Purpose: getLabelWithValue(
                        {
                            labelName: "Purpose",
                            labelKey: "BK_PCC_PURPOSE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingPurpose",
                        }
                    ),
                    Sector: getLabelWithValue(
                        {
                            labelName: "Sector",
                            labelKey: "BK_PCC_PROPERTY_SECTOR_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSector",
                        }
                    ),
                    Dimension: getLabelWithValue(
                        {
                            labelName: "Dimension",
                            labelKey: "BK_PCC_DIMENSION_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkDimension",
                        }
                    ),
                    Location: getLabelWithValue(
                        {
                            labelName: "Location",
                            labelKey: "BK_PCC_LOCATION_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkLocation",
                        }
                    ),
                    FromDate: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "BK_PCC_FROM_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFromDate",
                        }
                    ),
                    ToDate: getLabelWithValue(
                        {
                            labelName: "To Date",
                            labelKey: "BK_PCC_TO_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkToDate",
                        }
                    ),
                    CleansingCharges: getLabelWithValue(
                        {
                            labelName: "Cleansing Charges",
                            labelKey: "BK_PCC_CLEANING_CHARGES_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCleansingCharges",
                        }
                    ),
                    Rent: getLabelWithValue(
                        {
                            labelName: "Rent",
                            labelKey: "BK_PCC_RENT_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkRent",
                        }
                    ),
                    FacilitationCharges: getLabelWithValue(
                        {
                            labelName: "Facilitation Charges",
                            labelKey: "BK_PCC_FACILITATION_CHARGES_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFacilitationCharges",
                        }
                    ),
                    SurchargeRent: getLabelWithValue(
                        {
                            labelName: "Surcharge on Rent",
                            labelKey: "BK_PCC_SURCHARGE_RENT_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSurchargeRent",
                        }
                    ),
                    Utgst: getLabelWithValue(
                        {
                            labelName: "Utgst",
                            labelKey: "BK_PCC_UTGST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkUtgst",
                        }
                    ),
                    Cgst: getLabelWithValue(
                        {
                            labelName: "Cgst",
                            labelKey: "BK_PCC_UTGST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCgst",
                        }
                    ),
                    CustomerGstNo: getLabelWithValue(
                        {
                            labelName: "Customer Gst No",
                            labelKey: "BK_PCC_UTGST_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCustomerGstNo",
                        }
                    ),
                    
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
        },
        type: "array",
    },
});
