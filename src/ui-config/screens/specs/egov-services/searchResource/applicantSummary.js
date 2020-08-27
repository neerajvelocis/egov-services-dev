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

export const applicantSummary = getCommonGrayCard({
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
                  labelKey: "MY_BK_APPLICANT_DETAILS_HEADER",
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
              applicantContainer: getCommonContainer({
                  applicantName: getLabelWithValue(
                      {
                          labelName: "Name",
                          labelKey: "BK_OSB_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkApplicantName",
                      }
                  ),
                  applicantEmail: getLabelWithValue(
                      {
                          labelName: "Email Address",
                          labelKey: "BK_OSB_EMAIL_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkEmail",
                      }
                  ),
                  applicantMobile: getLabelWithValue(
                      {
                          labelName: "Mobile Number",
                          labelKey: "BK_OSB_MOBILE_NO_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkMobileNumber",
                      }
                  )
              }),
          }),
          items: [],
          hasAddItem: false,
          isReviewPage: true,
          sourceJsonPath: "Booking",
        //   prefixSourceJsonPath:
        //       "children.cardContent.children.applicantContainer.children",
        //   afterPrefixJsonPath: "children.value.children.key",
      },
      type: "array",
  },
});
