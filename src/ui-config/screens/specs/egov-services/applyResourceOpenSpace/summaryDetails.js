import {
  getBreak,
  getCommonContainer,
  getCommonCard,
  getCommonHeader,
  getCommonTitle,
  getCommonSubHeader,
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};
export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["applyopenspace"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {

    activeStep = mode === "next" ? activeStep + 1 : 0;

  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 3 ? true : false;
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("applyopenspace", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};
export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "applyopenspace",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "applyopenspace",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "applyopenspace",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "applyopenspace",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};
export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};


export const summaryDetails = getCommonCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        // ...getCommonSubHeader({
        //   labelName: "Summary",
        //   labelKey: "BK_OSB_HEADER_STEP_4"
        // })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: callBackForPrevious
          // callBack: (state, dispatch) => {
          //   gotoApplyWithStep(state, dispatch, 0);
          // }
        }
      }
    }
  },
  break: getBreak(),
  SummaryDetails: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-services",
    componentPath: "SummaryDetailsContainer",
    props: {
      contents: [
        {
          label: "BK_OSB_NAME_LABEL",
          jsonPath: "bkApplicantName",
        },
        {
          label: "BK_OSB_EMAIL_LABEL",
          jsonPath: "bkEmail",
        },
        {
          label: "BK_OSB_MOBILE_NO_LABEL",
          jsonPath: "bkMobileNumber",
        },
        {
          label: "BK_OSB_HOUSE_NUMBER_LABEL",
          jsonPath: "bkHouseNo",
        },
        {
          label: "BK_OSB_COMPLETE_ADDRESS_LABEL",
          jsonPath: "bkCompleteAddress",
        },
        {
          label: "BK_OSB_PROPERTY_SECTOR_LABEL",
          jsonPath: "bkSector",
        },
        {
          label: "BK_OSB_PROPERTY_TYPE_LABEL",
          jsonPath: "bkType",
        },
        {
          label: "BK_OSB_STORAGE_AREA_LABEL",
          jsonPath: "bkAreaRequired",
        },
        {
          label: "BK_OSB_DURATION_LABEL",
          jsonPath: "bkDuration",
        },
        {
          label: "BK_OSB_CATEGORY_LABEL",
          jsonPath: "bkCategory",
        },
        {
          label: "BK_OSB_DOCUMENT_LABEL",
          jsonPath: "wfDocuments",
        },
      ],
      moduleName: "egov-services",
      homeURL: "/egov-services/applyservices",
    },
  },
  // documentsDetails : {
  //   uiFramework: "custom-containers-local",
  //     moduleName: "egov-services",
  //     componentPath: "DownloadFileContainer",
  //     props: {
  //       sourceJsonPath: "documentsPreview",
  //       className: "noc-review-documents"
  //     }
  // }
  // components: {
  //   div: {
  //     uiFramework: "custom-atoms",
  //     componentPath: "Div",
  //     props: {
  //       className: "common-div-css"
  //     },
  //     children: {
  //       // headerDiv: {
  //       //   uiFramework: "custom-atoms",
  //       //   componentPath: "Container",
  //       //   children: {
  //       //     header: {
  //       //       gridDefination: {
  //       //         xs: 12,
  //       //         sm: 10
  //       //       },

  //       //       ...titlebar

  //       //     }
  //       //   }
  //       // },
  //       body: getCommonCard({
  //         applicantSummary: applicantSummary,
  //         // nocSummary: nocSummary,
  //         documentsSummary: documentsSummary
  //       }),
  //     }
  //   },

 
  // }
});
