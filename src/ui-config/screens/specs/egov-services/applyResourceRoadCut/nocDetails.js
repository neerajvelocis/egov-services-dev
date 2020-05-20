import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, furnishRoadcutNocResponse } from "../../../../../ui-utils/commons";

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application Details",
      labelKey: "ROADCUT_NEW_NOC_DETAILS_HEADER_PET_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    typeOfApplicant: {
      ...getSelectField({
        label: {
          labelName: "Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "RoadCutTypeOfApplicant"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.RoadCutTypeOfApplicant",
        jsonPath: "ROADCUTNOC.typeOfApplicant",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    purposeOfRoadCutting: {
      ...getSelectField({
        label: {
          labelName: "Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "purposeOfRoadCutting"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.purposeOfRoadCutting",
        jsonPath: "ROADCUTNOC.purposeOfRoadCutting",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    // dummyDiv: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 12,
    //     md: 6
    //   },
    //   props: {
    //     disabled: true
    //   }
    // },

    applicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "ROADCUT_APPLICANT_NAME_LABEL_NOC"
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "ROADCUT_APPLICANT_NAME_PLACEHOLDER"
        },
        pattern: getPattern("VillageName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "ROADCUTNOC.applicantName"
      })
    },
    division: {
      ...getTextField({
        label: {
          labelName: "Division",
          labelKey: "ROADCUT_DIVISION_NOC"
        },
        placeholder: {
          labelName: "Enter Division",
          labelKey: "ROADCUT_DIVISION_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.division"
      })
    },
    ward: {
      ...getTextField({
        label: {
          labelName: "Ward",
          labelKey: "ROADCUT_WARD_NOC"
        },
        placeholder: {
          labelName: "Enter Ward",
          labelKey: "ROADCUT_WARD_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.ward"
      })
    },
    sector: {
      ...getSelectField({
        label: { labelName: "Sector", labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC" },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Sector",
          labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC"
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "ROADCUTNOC.sector",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },

      }),
    },
    requestedLocation: {
      ...getTextField({
        label: {
          labelName: "Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_NOC"
        },
        placeholder: {
          labelName: "Enter Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_PLACEHOLDER"
        },
        required: false,
         pattern: getPattern("Address"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.requestedLocation"
      })
    },
    landmark: {
      ...getTextField({
        label: {
          labelName: "Landmark",
          labelKey: "ROADCUT_LANDMARK_NOC"
        },
        placeholder: {
          labelName: "Enter Landmark",
          labelKey: "ROADCUT_LANDMARK_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.landmark"
      })
    },
    length: {
      ...getTextField({
        label: {
          labelName: "Length",
          labelKey: "ROADCUT_LENGTH_LABEL_NOC"

        },
        localePrefix: {
          moduleName: "egpm",
          masterName: "length"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Length",
          labelKey: "ROADCUT_LENGTH_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.length",
        jsonPath: "ROADCUTNOC.length",
        required: true,
		pattern: getPattern("Amount"),
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    width: {
      ...getTextField({
        label: {
          labelName: "Width",
          labelKey: "ROADCUT_WIDTH_NOC"
        },
        placeholder: {
          labelName: "Enter Width",
          labelKey: "ROADCUT_WIDTH_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "ROADCUTNOC.width"
      })
    },


  })
});