import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getDateField, getTimeField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { furnishNocResponse, getSearchResults } from "../../../../../ui-utils/commons";
import {
  getTodaysDateInYMD,
  getFinancialYearDates,
} from "../../utils";

export const personalDetails = getCommonCard({
  // header: getCommonTitle(
  //   {
  //     labelName: "Applicant Details",
  //     labelKey: "BK_WTB_DETAILS_HEADER",
  //   },
  //   {
  //     style: {
  //       marginBottom: 10,
  //     },
  //   }
  // ),
  // break: getBreak(),
  personalDetailsContainer: getCommonContainer({
    bkApplicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "BK_WTB_NAME_LABEL",
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "BK_WTB_NAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkApplicantName",
      }),
    },
    bkEmail: {
      ...getTextField({
        label: {
          labelName: "Email Address",
          labelKey: "BK_WTB_EMAIL_LABEL",
        },
        placeholder: {
          labelName: "Enter Email Address",
          labelKey: "BK_WTB_EMAIL_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Email"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkEmail",
      }),
    },
    bkMobileNumber: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "BK_WTB_MOBILE_NO_LABEL",
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "BK_WTB_MOBILE_NO_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkMobileNumber",
      }),
    },
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
export const bookingDetails = getCommonCard({
  // header: getCommonTitle(
  //     {
  //         labelName: "Booking Details",
  //         labelKey: "BK_WTB_DETAILS_HEADER",
  //     },
  //     {
  //         style: {
  //             marginBottom: 10,
  //         },
  //     }
  // ),
  // break: getBreak(),
  bookingDetailsContainer: getCommonContainer({
     
    bkHouseNo: {
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
              jsonPath: "Booking.bkHouseNo",
          }),
      },
      bkCompleteAddress: {
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
              jsonPath: "Booking.bkCompleteAddress",
          }),
      },
      bkSector: {
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
              sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
              jsonPath: "Booking.bkSector",
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              required: true,
              props: {
                  // className: "applicant-details-error",
                  required: true,
                  // disabled: true
              },
          }),
      },
      bkType: {
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
              sourceJsonPath: "applyScreenMdmsData.Booking.CityType",
              jsonPath: "Booking.bkType",
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              required: true,
              props: {
                  // className: "applicant-details-error",
                  required: true,
                  // disabled: true
              },
          }),
      },
      bkDate: {
        ...getDateField({
          label: {
            labelName: "Booking Date",
            labelKey: "BK_WTB_DATE_LABEL",
          },
          placeholder: {
            labelName: "Booking Data",
            labelName: "BK_WTB_DATE_PLACEHOLDER",
          },
          // required: true,
          pattern: getPattern("Date"),
          jsonPath: "Booking.bkDate",
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          props: {
            className: "applicant-details-error",
            inputProps: {
              min: getTodaysDateInYMD(),
              max: getFinancialYearDates("yyyy-mm-dd").endDate,
            },
          },
          gridDefination:{
            xs: 12,
            sm: 6,
            md: 6
          }
        }),
        // visible: true,
      },
      bkTime: {
        ...getTimeField({
          label: {
            labelName: "Booking Time",
            labelKey: "BK_WTB_TIME_LABEL",
          },
          placeholder: { labelName: "hh:mm", labelKey: "hh:mm" },
          required: true,
          pattern: getPattern("Time"),
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "Booking.bkTime",
          gridDefination: {
            xs: 12,
            sm: 6,
            md: 6
          },
          props: {
            // inputProps: {
            //   min: getTodaysDateInYMD(),
            //   max: getFinancialYearDates("yyyy-mm-dd").endDate,
            // },
            defaultValue: "00:00",
            // iconObj: { position: "end", iconName: " access_time" },
            // style: { marginBottom: 10, paddingRight: 80 },
          },
        }),
      },
      bkStatus: {
        ...getSelectField({
          label: {
            labelName: "Booking Date",
            labelKey: "BK_WTB_CASE_LABEL",
          },
          placeholder: {
            labelName: "Booking Data",
            labelName: "BK_WTB_CASE_PLACEHOLDER",
          },
          // required: true,
          pattern: getPattern("Name"),
          jsonPath: "Booking.bkStatus",
          sourceJsonPath: "applyScreenMdmsData.Booking.bookingType",
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          required : true,
          props: {
            required: true
            // className: "applicant-details-error",
            // inputProps: {
            //   min: getTodaysDateInYMD(),
            //   max: getFinancialYearDates("yyyy-mm-dd").endDate,
            // },
          },
          gridDefination:{
            xs: 12,
            sm: 6,
            md: 6
          }
        }),
        // visible: true,
      },
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

