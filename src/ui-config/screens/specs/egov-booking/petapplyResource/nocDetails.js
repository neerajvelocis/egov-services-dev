import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults
} from "../../../../../ui-utils/commons";


const prepareSelectField = (uom, start, end) => {
  let data = [];
  for (let i = start; i <= end; i++) {
    data.push({ code: `${i}` });
  }
  return {
    ...getSelectField({
      label: {
        labelKey: `NOC_PROPERTY_DETAILS_${uom}_LABEL`
      },
      placeholder: {
        labelKey: `NOC_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
      },
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      jsonPath: `FireNOCs[0].fireNOCDetails.buildings[0].uomsMap.${uom}`,
      data: data,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props:{
        className:"applicant-details-error"
      }
    })
  };
};

const prepareTextField = uom => {
  return {
    ...getTextField({
      label: {
        labelKey: `NOC_PROPERTY_DETAILS_${uom}_LABEL`
      },
      placeholder: {
        labelKey: `NOC_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
      },
      pattern: /^\d{0,10}$/i,
      
    //   onInput:(e)=>{ 
    //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
    // },
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      // required: true,
      jsonPath: `FireNOCs[0].fireNOCDetails.buildings[0].uomsMap.${uom}`,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props:{
        className:"applicant-details-error"
      }
    })
  };
};

const loadProvisionalNocData = async (state, dispatch) => {
  let fireNOCNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.EgovOPMS[0].provisionFireNOCNumber",
    ""
  );


  if (!fireNOCNumber.match(getPattern("FireNOCNo"))) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Incorrect FireNOC Number!",
          labelKey: "ERR_FIRENOC_NUMBER_INCORRECT"
        },
        "error"
      )
    );
    return;
  }

  let response = await getSearchResults([
    { key: "fireNOCNumber", value: fireNOCNumber }
  ]);

  response = furnishNocResponse(response);

  dispatch(prepareFinalObject("EgovOPMS", get(response, "EgovOPMS", [])));

  // Set no of buildings radiobutton and eventually the cards
 /* let noOfBuildings =
    get(response, "EgovOPMS[0].EgovOPMSDetails.noOfBuildings", "SINGLE") ===
    "MULTIPLE"
      ? "MULTIPLE"
      : "SINGLE";
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
      "props.value",
      noOfBuildings
    )
  );

  // Set noc type radiobutton to NEW
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
      "props.value",
      "NEW"
    )
  );
*/
  // Set provisional fire noc number
  dispatch(
    prepareFinalObject(
      "EgovOPMS[0].provisionFireNOCNumber",
      get(response, "EgovOPMS[0].fireNOCNumber", "")
    )
  );

  // Set fire noc id to null
  dispatch(prepareFinalObject("EgovOPMS[0].id", undefined));
};

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "PET NOC Details",
      labelKey: "NOC_NEW_PET_NOC_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  
});

export const ApplicationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Application Details",
        labelKey: "PET_NOC_APPLICATION_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    applicationDetailsConatiner: getCommonContainer({
      applicationId: getTextField({
        label: {
          labelName: "Application ID",
          labelKey: "PET_NOC_APPLICATION_ID_LABEL"
        },
        placeholder: {
          labelName: "Application ID",
          labelKey: "PET_NOC_APPLICATION_ID_LABE"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           // callBack: (state, dispatch) => {
           //   getDetailsFromProperty(state, dispatch);
           // }
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.ApplicantDetails.applicationId"
      }),
	  applicantName: getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "PET_NOC_APPLICANT_NAME"
        },
        placeholder: {
          labelName: "Applicant Name",
          labelKey: "PET_NOC_APPLICANT_NAME"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.ApplicantDetails.applicantName"
      }),
	  houseNo: getTextField({
        label: {
          labelName: "House No.",
          labelKey: "PET_NOC_HOUSE_NUMBER"
        },
        placeholder: {
           labelName: "House No.",
          labelKey: "PET_NOC_HOUSE_NUMBER"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.ApplicantDetails.houseNo"
      }),
      Sector: {
        ...getSelectField({
          label: { labelName: "City", labelKey: "NOC_PROPERTY_CITY_LABEL" },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: {
            labelName: "Select Sector",
            labelKey: "PET_NOC_PROPERTY_CITY_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "EgovOPMS[0].EgovOPMSDetails.ApplicantDetails.Sector",
          required: true,
          props: {
            className:"applicant-details-error",
            required: true
            // disabled: true
          }
        }),
     /*   beforeFieldChange: async (action, state, dispatch) => {
          //Below only runs for citizen - not required here in employee
          dispatch(
            prepareFinalObject(
              "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
              action.value
            )
          );
          try {
            let payload = await httpRequest(
              "post",
              "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
              "_search",
              [{ key: "tenantId", value: action.value }],
              {}
            );
            const mohallaData =
              payload &&
              payload.TenantBoundary[0] &&
              payload.TenantBoundary[0].boundary &&
              payload.TenantBoundary[0].boundary.reduce((result, item) => {
                result.push({
                  ...item,
                  name: `${action.value
                    .toUpperCase()
                    .replace(
                      /[.]/g,
                      "_"
                    )}_REVENUE_${item.code
                    .toUpperCase()
                    .replace(/[._:-\s\/]/g, "_")}`
                });
                return result;
              }, []);

            dispatch(
              prepareFinalObject(
                "applyScreenMdmsData.tenant.localities",
                mohallaData
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardSecondStep.children.propertyLocationDetails.children.cardContent.children.propertyDetailsConatiner.children.propertyMohalla",
                "props.suggestions",
                mohallaData
              )
            );
            const mohallaLocalePrefix = {
              moduleName: action.value,
              masterName: "REVENUE"
            };
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardSecondStep.children.propertyLocationDetails.children.cardContent.children.propertyDetailsConatiner.children.propertyMohalla",
                "props.localePrefix",
                mohallaLocalePrefix
              )
            );

            dispatch(
              fetchLocalizationLabel(getLocale(), action.value, action.value)
            );
          } catch (e) {
            console.log(e);
          }
          // Set Firestation based on ULBl
          let fireStationsList = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.firenoc.FireStations",
            []
          );
          let fireStations = fireStationsList.filter(firestation => {
            return firestation.baseTenantId === action.value;
          });
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardSecondStep.children.propertyLocationDetails.children.cardContent.children.propertyDetailsConatiner.children.propertyFirestation",
              "props.data",
              fireStations
            )
          );
        }  */
      },
	  
	  }),
});



export const PetParticularDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Particulars Of Pet Dog",
        labelKey: "PARTICULARS_OF_PET_DOG"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    applicationDetailsConatiner: getCommonContainer({
      NameofDog: getTextField({
        label: {
          labelName: "Name Of Pet Dog",
          labelKey: "NAME_OF_PET_DOG_LABEL"
        },
        placeholder: {
          labelName: "Name Of Pet Dog",
          labelKey: "NAME_OF_PET_DOG_LABEL"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           // callBack: (state, dispatch) => {
           //   getDetailsFromProperty(state, dispatch);
           // }
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.NameofDog"
      }),
	  Age: getTextField({
        label: {
         labelName: "AGE",
          labelKey: "AGE_LABEL"
        },
        placeholder: {
            labelName: "AGE",
          labelKey: "AGE_LABEL"
        },
        
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.AgeofDog"
      }),
	  Sex: getTextField({
        label: {
           labelName: "SEX",
          labelKey: "SEX_LABEL"
        },
       
        placeholder: {
           labelName: "SEX",
          labelKey: "SEX_LABEL"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.SexofDog"
      }),
      Breed: {
        ...getSelectField({
          label: { labelName: "Breed", labelKey: "DOG_BREED_LABEL" },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: {
            labelName: "Select Breed",
            labelKey: "PET_NOC_BREED_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.BreedofDog",
          required: true,
          props: {
            className:"applicant-details-error",
            required: true
            // disabled: true
          }
        }),
     
      },
	  
	  Color: {
        ...getSelectField({
          label: { labelName: "Color", labelKey: "DOG_COLOR_LABEL" },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: {
            labelName: "Select COLOR",
            labelKey: "PET_NOC_BREED_COLOR_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.ColorofDog",
          required: true,
          props: {
            className:"applicant-details-error",
            required: true
            // disabled: true
          }
        }),
     
      },
	  
	 IdentificationMark: getTextField({
        label: {
         labelName: "Identification Mark",
          labelKey: "IDENTIFICATION_MARK_LABEL"
        },
        placeholder: {
           labelName: "Identification Mark",
          labelKey: "IDENTIFICATION_MARK_LABEL"
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
           
          }
        },
        jsonPath: "EgovOPMS[0].EgovOPMSDetails.PetParticularDetails.IdentificationMark"
      }),
	  
	  }),
});