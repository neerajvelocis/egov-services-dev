import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {convertDateInDMY} from "../../utils"

export const waterTankerSummary = getCommonGrayCard({
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
                  labelKey: "BK_WTB_APPLICATION_DETAILS_HEADER",
              }),
          }
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
                    labelKey: "BK_WTB_NAME_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkApplicantName",
                  }
                ),
                applicantEmail: getLabelWithValue(
                  {
                    labelName: "Email Address",
                    labelKey: "BK_WTB_EMAIL_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkEmail",
                  }
                ),
                applicantMobile: getLabelWithValue(
                  {
                    labelName: "Mobile Number",
                    labelKey: "BK_WTB_MOBILE_NO_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkMobileNumber",
                  }
                ),
                HouseNo: getLabelWithValue(
                  {
                    labelName: "House No.",
                    labelKey: "BK_WTB_HOUSE_NUMBER_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkHouseNo",
                  }
                ),
                CompleteAddress: getLabelWithValue(
                  {
                    labelName: "House No.",
                    labelKey: "BK_WTB_COMPLETE_ADDRESS_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkCompleteAddress",
                  }
                ),
                Sector: getLabelWithValue(
                  {
                    labelName: "Sector",
                    labelKey: "BK_WTB_PROPERTY_SECTOR_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkSector",
                  }
                ),
                PropertyType: getLabelWithValue(
                  {
                    labelName: "Residential/Commercial",
                    labelKey: "BK_WTB_PROPERTY_TYPE_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkType",
                  }
                ),
                BookingDate: getLabelWithValue(
                  {
                    labelName: "Booking Date",
                    labelKey: "BK_WTB_DATE_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkDate",
                    callBack: convertDateInDMY
                  }
                ),
                BookingTime: getLabelWithValue(
                  {
                    labelName: "Booking Time",
                    labelKey: "BK_WTB_TIME_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkTime",
                  }
                ),
                BookingCase: getLabelWithValue(
                  {
                    labelName: "Case",
                    labelKey: "BK_WTB_CASE_LABEL",
                  },
                  {
                    jsonPath: "Booking.bkStatus",
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
