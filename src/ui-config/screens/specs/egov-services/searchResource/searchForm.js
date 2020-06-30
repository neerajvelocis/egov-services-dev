import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getSelectField,
  getPattern,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const callBackForPrevious = (state, dispatch) => {
  alert("in previous")
};
export const callBackForNext = (state, dispatch) => {
  alert("in next")
  let payload = get(
    state.screenConfiguration.preparedFinalObject,
    "Booking",
    []
  );
  console.log("newdata", payload);
  
};

export const searchDetails = getCommonCard({
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
  // header: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "Container",
  //   props: {
  //     style: { marginBottom: "10px" }
  //   },
  //   children: {
  //     header: {
  //       gridDefination: {
  //         xs: 8
  //       },
  //       ...getCommonSubHeader({
  //         labelName: "Summary",
  //         labelKey: "BK_OSB_HEADER_STEP_4"
  //       })
  //     },
  //     editSection: {
  //       componentPath: "Button",
  //       props: {
  //         color: "primary",
  //         style: {
  //           marginTop: "-10px",
  //           marginRight: "-18px"
  //         }
  //       },
  //       gridDefination: {
  //         xs: 4,
  //         align: "right"
  //       },
  //       children: {
  //         editIcon: {
  //           uiFramework: "custom-atoms",
  //           componentPath: "Icon",
  //           props: {
  //             iconName: "edit"
  //           }
  //         },
  //         buttonLabel: getLabel({
  //           labelName: "Edit",
  //           labelKey: "NOC_SUMMARY_EDIT"
  //         })
  //       },
  //       onClickDefination: {
  //         action: "condition",
  //         callBack: callBackForPrevious
  //       }
  //     }
  //   }
  // },

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
        jsonPath: "Booking.bkHouseNo",
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
        jsonPath: "Booking.bkCompleteAddress",
      }),
    },
    bkSector: {
      ...getSelectField({
        label: {
          labelName: "Sector",
          labelKey: "BK_OSB_PROPERTY_SECTOR_LABEL",
        },
        // localePrefix: {
        //   moduleName: "egpm",
        //   masterName: "sector"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Sector",
          labelKey: "BK_OSB_PROPERTY_SECTOR_PLACEHOLDER",
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
        jsonPath: "Booking.bkSector",
        required: false,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
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
    //     jsonPath: "Booking.bkVillCity",
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
        jsonPath: "Booking.bkType",
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
        jsonPath: "Booking.bkAreaRequired",
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
        jsonPath: "Booking.bkDuration",
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
        jsonPath: "Booking.bkCategory",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
          // disabled: true
        },
      }),
    },
    // submitButton: {
    //   componentPath: "Button",
    //   props: {
    //     color: "primary",
    //     style: {
    //       marginTop: "-10px",
    //       marginRight: "-18px"
    //     }
    //   },
    //   gridDefination: {
    //     xs: 4,
    //     align: "right"
    //   },
    //   children: {
    //     editIcon: {
    //       uiFramework: "custom-atoms",
    //       componentPath: "Icon",
    //       props: {
    //         iconName: "edit"
    //       }
    //     },
    //     buttonLabel: getLabel({
    //       labelName: "Edit",
    //       labelKey: "NOC_SUMMARY_EDIT"
    //     })
    //   },
    //   onClickDefination: {
    //     action: "condition",
    //     callBack: callBackForPrevious
    //   }
    // },
    previousButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        // previousButtonIcon: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Icon",
        //   props: {
        //     iconName: "keyboard_arrow_left"
        //   }
        // },
        previousButtonLabel: getLabel({
          labelName: "Cancel",
          labelKey: "NOC_COMMON_BUTTON_PREV_STEP"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForPrevious
      },
      visible: true
    },
    payButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          //minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "Submit",
          labelKey: "NOC_COMMON_BUTTON_SUBMIT"
        }),
        // submitButtonIcon: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Icon",
        //   props: {
        //     iconName: "keyboard_arrow_right"
        //   }
        // }
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext
      },
      visible: true
    }

  }),
});
