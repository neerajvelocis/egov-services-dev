import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getSelectField,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Applicant Details",
      labelKey: "BK_OSB_HEADER_STEP_1",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    bkApplicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "BK_OSB_NAME_LABEL",
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "BK_OSB_NAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.ApplicantName",
      }),
    },
    bkEmail: {
      ...getTextField({
        label: {
          labelName: "Email Address",
          labelKey: "BK_OSB_EMAIL_LABEL",
        },
        placeholder: {
          labelName: "Enter Email Address",
          labelKey: "BK_OSB_EMAIL_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Email"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.Email",
      }),
    },
    bkMobileNumber: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "BK_OSB_MOBILE_NO_LABEL",
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "BK_OSB_MOBILE_NO_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.MobileNumber",
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
  header: getCommonTitle(
    {
      labelName: "Applicant Details",
      labelKey: "BK_OSB_HEADER_STEP_2",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),

  applicationDetailsConatiner: getCommonContainer({
    bkHouseNo: {
      ...getTextField({
        label: {
          labelName: "House/Site No.",
          labelKey: "BK_OSB_HOUSE_NUMBER_LABEL",
        },
        placeholder: {
          labelName: "Enter House No",
          labelKey: "BK_OSB_HOUSE_NUMBER_PLACEHOLDER",
        },
        pattern: getPattern("DoorHouseNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "Booking.HouseNo",
      }),
    },
    bkCompleteAddress: {
      ...getTextField({
        label: {
          labelName: "Complete Address",
          labelKey: "BK_OSB_COMPLETE_ADDRESS_LABEL",
        },
        placeholder: {
          labelName: "Enter Complete Address",
          labelKey: "BK_OSB_COMPLETE_ADDRESS_PLACEHOLDER",
        },
        // pattern: getPattern("DoorHouseNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "Booking.CompleteAddress",
      }),
    },
    // bkSector: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Sector",
    //       labelKey: "BK_OSB_PROPERTY_SECTOR_LABEL",
    //     },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "sector"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select Sector",
    //       labelKey: "BK_OSB_PROPERTY_SECTOR_PLACEHOLDER",
    //     },
    //     //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
    //     sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
    //     jsonPath: "Booking.Sector",
    //     required: true,
    //     props: {
    //       className: "applicant-details-error",
    //       required: true,
    //       // disabled: true
    //     },
    //   }),
    // },
    // bkVillCity: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Village/City",
    //       labelKey: "BK_OSB_CITY_LABEL",
    //     },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "sector"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select Village/City",
    //       labelKey: "BK_OSB_CITY_PLACEHOLDER",
    //     },
    //     //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
    //     sourceJsonPath: "applyScreenMdmsData.Booking.City",
    //     jsonPath: "Booking.VillCity",
    //     // required: true,
    //     props: {
    //       className: "applicant-details-error",
    //     //   required: true,
    //       // disabled: true
    //     },
    //   }),
    // },
    bkType: {
      ...getSelectField({
        label: {
          labelName: "Residential/Commercial",
          labelKey: "BK_OSB_PROPERTY_TYPE_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        // optionLabel: "name",
        placeholder: {
          labelName: "Select Residential/Commercial",
          labelKey: "BK_OSB_PROPERTY_TYPE_PLACEHOLDER",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.Booking.CityType",
        jsonPath: "Booking.Type",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    bkAreaRequired: {
      ...getSelectField({
        label: {
          labelName: "Storage Area",
          labelKey: "BK_OSB_STORAGE_AREA_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Storage Area",
          labelKey: "BK_OSB_STORAGE_AREA_PLACEHOLDER",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.Booking.Area",
        jsonPath: "Booking.AreaRequired",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    bkDuration: {
      ...getSelectField({
        label: {
          labelName: "Duration",
          labelKey: "BK_OSB_DURATION_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Duration",
          labelKey: "BK_OSB_DURATION_PLACEHOLDER",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.Booking.Duration",
        jsonPath: "Booking.Duration",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    bkCategory: {
      ...getSelectField({
        label: {
          labelName: "Category",
          labelKey: "BK_OSB_CATEGORY_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Category",
          labelKey: "BK_OSB_CATEGORY_PLACEHOLDER",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.Booking.Category",
        jsonPath: "Booking.Category",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
  }),
});
