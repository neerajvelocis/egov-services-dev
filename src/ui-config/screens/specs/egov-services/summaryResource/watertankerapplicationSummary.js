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

export const waterTankerApplicationSummary = getCommonGrayCard({
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
          applicationNumber: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "MY_BK_APPLICATION_NUMBER_LABEL",
            },
            {
              jsonPath: "Booking[0].bkApplicationNumber",
            }
          ),
          applicationStatus: getLabelWithValue(
            {
              labelName: "Application Status",
              labelKey: "MY_BK_APPLICATION_STATUS_LABEL",
            },
            {
              jsonPath: "Booking[0].bkApplicationStatus",
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "MY_BK_NAME_LABEL",
            },
            {
              jsonPath: "Booking[0].bkApplicantName",
            }
          ),
          applicantEmail: getLabelWithValue(
            {
              labelName: "Email Address",
              labelKey: "MY_BK_EMAIL_LABEL",
            },
            {
              jsonPath: "Booking[0].bkEmail",
            }
          ),
          applicantMobile: getLabelWithValue(
            {
              labelName: "Mobile Number",
              labelKey: "MY_BK_MOBILE_NUMBER_LABEL",
            },
            {
              jsonPath: "Booking[0].bkMobileNumber",
            }
          ),
          HouseNo: getLabelWithValue(
            {
              labelName: "House No.",
              labelKey: "MY_BK_HOUSE_NO_LABEL",
            },
            {
              jsonPath: "Booking[0].bkHouseNo",
            }
          ),
          CompleteAddress: getLabelWithValue(
            {
              labelName: "House No.",
              labelKey: "MY_BK_COMPLETE_ADDRESS_LABEL",
            },
            {
              jsonPath: "Booking[0].bkCompleteAddress",
            }
          ),
          Sector: getLabelWithValue(
            {
              labelName: "Sector",
              labelKey: "MY_BK_PROPERTY_SECTOR_LABEL",
            },
            {
              jsonPath: "Booking[0].bkSector",
            }
          ),
          PropertyType: getLabelWithValue(
            {
              labelName: "Residential/Commercial",
              labelKey: "MY_BK_PROPERTY_TYPE_LABEL",
            },
            {
              jsonPath: "Booking[0].bkType",
            }
          ),
          BookingDate: getLabelWithValue(
            {
              labelName: "Booking Date",
              labelKey: "MY_BK_DATE_LABEL",
            },
            {
              jsonPath: "Booking[0].bkDate",
            }
          ),
          BookingTime: getLabelWithValue(
            {
              labelName: "Booking Time",
              labelKey: "MY_BK_TIME_LABEL",
            },
            {
              jsonPath: "Booking[0].bkTime",
            }
          ),
          BookingCase: getLabelWithValue(
            {
              labelName: "Case",
              labelKey: "MY_BK_CASE_LABEL",
            },
            {
              jsonPath: "Booking[0].bkCase",
            }
          )
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
