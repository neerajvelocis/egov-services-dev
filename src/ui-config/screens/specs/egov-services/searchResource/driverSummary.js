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

export const driverSummary = getCommonGrayCard({
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
                  labelName: "Driver Details",
                  labelKey: "MY_BK_DRIVER_DETAILS_HEADER",
              }),
          },
      },
  },
  normalCase: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
          className: "sellmeatapplicant-summary",
          scheama: getCommonGrayCard({
              driverContainer: getCommonContainer({
                  driverName: getLabelWithValue(
                      {
                          labelName: "Driver Name",
                          labelKey: "MY_BK_DRIVER_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkDriverName",
                      }
                  ),
                  driverMobile: getLabelWithValue(
                      {
                          labelName: "Driver Contact",
                          labelKey: "MY_BK_DRIVER_MOBILE_NO_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkContactNo",
                      }
                  ),
                  approverName: getLabelWithValue(
                      {
                          labelName: "Approver",
                          labelKey: "MY_BK_APPROVER_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkApproverName",
                      }
                  )
              }),
          }),
          items: [],
          hasAddItem: false,
          isReviewPage: true,
          sourceJsonPath: "Booking",
          prefixSourceJsonPath:
              "children.cardContent.children.driverContainer.children",
          afterPrefixJsonPath: "children.value.children.key",
      },
      type: "array",
  },
  paidCase: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
        className: "sellmeatapplicant-summary",
        scheama: getCommonGrayCard({
            driverContainer: getCommonContainer({
                driverName: getLabelWithValue(
                    {
                        labelName: "Driver Name",
                        labelKey: "MY_BK_DRIVER_NAME_LABEL",
                    },
                    {
                        jsonPath: "Booking.bkDriverName",
                    }
                ),
                driverMobile: getLabelWithValue(
                    {
                        labelName: "Driver Contact",
                        labelKey: "MY_BK_DRIVER_MOBILE_NO_LABEL",
                    },
                    {
                        jsonPath: "Booking.bkContactNo",
                    }
                )
            }),
        }),
        items: [],
        hasAddItem: false,
        isReviewPage: true,
        sourceJsonPath: "Booking",
        prefixSourceJsonPath:
            "children.cardContent.children.driverContainer.children",
        afterPrefixJsonPath: "children.value.children.key",
    },
    type: "array",
},
});
