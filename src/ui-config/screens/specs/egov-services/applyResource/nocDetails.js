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

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "PET NOC Details",
      labelKey: "NOC_NEW_NOC_DETAILS_HEADER_PET",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    applicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "NOC_APPLICANT_NAME_LABEL",
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "NOC_APPLICANT_NAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.applicantName",
      }),
    },
    houseNumber: {
      ...getTextField({
        label: {
          labelName: "House/Site No.",
          labelKey: "NOC_HOUSE_NUMBER_LABEL",
        },
        placeholder: {
          labelName: "Enter House No",
          labelKey: "NOC_HOUSE_NUMBER_PLACEHOLDER",
        },
        pattern: getPattern("DoorHouseNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "PETNOC.houseNo",
      }),
    },
    completeAddress: {
      ...getTextField({
        label: {
          labelName: "Complete Address",
          labelKey: "NOC_COMPLETE_ADDRESS_LABEL",
        },
        placeholder: {
          labelName: "Enter Complete Address",
          labelKey: "NOC_COMPLETE_ADDRESS_PLACEHOLDER",
        },
        // pattern: getPattern("DoorHouseNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "PETNOC.completeAddress",
      }),
    },
    Sector: {
      ...getSelectField({
        label: { labelName: "Sector", labelKey: "NOC_PROPERTY_SECTOR_LABEL" },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Sector",
          labelKey: "NOC_PROPERTY_SECTOR_LABEL",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "PETNOC.sector",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    // City: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Village/City",
    //       labelKey: "NOC_PROPERTY_CITY_LABEL",
    //     },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "sector"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select Village/City",
    //       labelKey: "NOC_PROPERTY_CITY_LABEL",
    //     },
    //     //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
    //     sourceJsonPath: "applyScreenMdmsData.egpm.city",
    //     jsonPath: "PETNOC.city",
    //     // required: true,
    //     props: {
    //       className: "applicant-details-error",
    //     //   required: true,
    //       // disabled: true
    //     },
    //   }),
    // },
    propertyType: {
      ...getSelectField({
        label: {
          labelName: "Residential/Commercial",
          labelKey: "NOC_PROPERTY_TYPE_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        // optionLabel: "name",
        placeholder: {
          labelName: "Select Residential/Commercial",
          labelKey: "NOC_PROPERTY_TYPE_LABEL",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.propertyType",
        jsonPath: "PETNOC.propertyType",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    storageArea: {
      ...getSelectField({
        label: {
          labelName: "Storage Area",
          labelKey: "NOC_PROPERTY_STORAGE_AREA_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Storage Area",
          labelKey: "NOC_PROPERTY_STORAGE_AREA_LABEL",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.storageArea",
        jsonPath: "PETNOC.storageArea",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    Duration: {
      ...getSelectField({
        label: {
          labelName: "Duration",
          labelKey: "NOC_PROPERTY_DURATION_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Duration",
          labelKey: "NOC_PROPERTY_DURATION_LABEL",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.duration",
        jsonPath: "PETNOC.duration",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    Category: {
      ...getSelectField({
        label: {
          labelName: "Category",
          labelKey: "NOC_PROPERTY_CATEGORY_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Category",
          labelKey: "NOC_PROPERTY_CATEGORY_LABEL",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.category",
        jsonPath: "PETNOC.category",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    Email: {
      ...getTextField({
        label: {
          labelName: "Email Address",
          labelKey: "NOC_APPLICANT_EMAIL_LABEL",
        },
        placeholder: {
          labelName: "Enter Email Address",
          labelKey: "NOC_APPLICANT_Email_PLACEHOLDER",
        },
        // required: true,
        pattern: getPattern("Email"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.emailId",
      }),
    },
    mobile : {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "NOC_APPLICANT_MOBILE_LABEL",
        },
        placeholder: {
          labelName: "Enter Contact Number",
          labelKey: "NOC_APPLICANT_MOBILE_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.mobileNumber",
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

export const PetParticularDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Particulars Of Pet Dog",
      labelKey: "PARTICULARS_OF_PET_DOG",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),

  applicationDetailsConatiner: getCommonContainer({
    NameofDog: getTextField({
      label: {
        labelName: "Name Of Pet Dog",
        labelKey: "NAME_OF_PET_DOG_LABEL",
      },
      placeholder: {
        labelName: "Name Of Pet Dog",
        labelKey: "NAME_OF_PET_DOG_LABEL",
      },
      /*iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           // callBack: (state, dispatch) => {
           //   getDetailsFromProperty(state, dispatch);
           // }
          }
        },*/
      pattern: getPattern("VillageName"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      jsonPath: "PETNOC.nameOfPetDog",
    }),

    Age: {
      ...getSelectField({
        label: { labelName: "Age", labelKey: "DOG_AGE_LABEL" },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "age"
        // },
        optionLabel: "name",
        optionValue: "name",
        placeholder: {
          labelName: "Select Age",
          labelKey: "DOG_AGE_LABEL",
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.age",
        //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "PETNOC.age",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
        required: true,
      }),
    },

    // Sex: {
    //   ...getSelectField({
    //     label: { labelName: "Sex", labelKey: "DOG_SEX_LABEL" },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "sex"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select Sex",
    //       labelKey: "DOG_SEX_LABEL",
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.egpm.sex",
    //     //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    //     jsonPath: "PETNOC.sex",
    //     required: true,
    //     props: {
    //       className: "applicant-details-error",
    //       required: true,
    //       // disabled: true
    //     },
    //     required: true,
    //   }),
    // },
    // Breed: {
    //   ...getSelectField({
    //     label: { labelName: "Breed", labelKey: "DOG_BREED_LABEL" },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "breed"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select Breed",
    //       labelKey: "DOG_BREED_LABEL",
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.egpm.breed",
    //     //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    //     jsonPath: "PETNOC.breed",
    //     props: {
    //       className: "applicant-details-error",
    //       required: true,
    //       // disabled: true
    //     },
    //     required: true,
    //   }),
    // },

    // Color: {
    //   ...getSelectField({
    //     label: { labelName: "Color", labelKey: "DOG_COLOR_LABEL" },
    //     // localePrefix: {
    //     //   moduleName: "egpm",
    //     //   masterName: "color"
    //     // },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Select COLOR",
    //       labelKey: "DOG_COLOR_LABEL",
    //     },
    //     sourceJsonPath: "applyScreenMdmsData.egpm.color",
    //     // sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    //     jsonPath: "PETNOC.color",
    //     required: true,
    //     props: {
    //       className: "applicant-details-error",
    //       required: true,
    //       // disabled: true
    //     },
    //   }),
    // },

    // IdentificationMark: getTextField({
    //   label: {
    //     labelName: "Identification Mark",
    //     labelKey: "IDENTIFICATION_MARK_LABEL",
    //   },
    //   placeholder: {
    //     labelName: "Identification Mark",
    //     labelKey: "IDENTIFICATION_MARK_LABEL",
    //   },
    //   required: true,
    //   /* iconObj: {
    //        iconName: "search",
    //        position: "end",
    //        color: "#FE7A51",
    //        onClickDefination: {
    //          action: "condition",
            
    //        }
    //      },*/
    //   pattern: getPattern("Name"),
    //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //   jsonPath: "PETNOC.identificationMark",
    //   props: {
    //     className: "applicant-details-error",
    //     required: true,
    //     // disabled: true
    //   },
    // }),
  }),
});
