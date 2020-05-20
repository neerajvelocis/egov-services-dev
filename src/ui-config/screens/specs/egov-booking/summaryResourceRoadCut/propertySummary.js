import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import {
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";

const test = value => {
  value = value ? value.split(".")[0] : "";
  return value;
};

const tenantId = getQueryArg(window.location.href, "tenantId");

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-noc",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const propertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "noc-summary",
    scheama: getCommonGrayCard({
      propertyContainer: getCommonContainer({
        nameofVeterinaryDoctor: getLabelWithValue(
          {
            labelName: "Name of Veterinary Doctor ",
            labelKey: "NOC_VETERINARY_DOCTOR_NAME"
          },
          {
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let immunizationNameVeterinaryDoctor = JSON.parse(value).hasOwnProperty('immunizationNameVeterinaryDoctor')?JSON.parse(value)['immunizationNameVeterinaryDoctor']:'';
              return immunizationNameVeterinaryDoctor;
              }else{
                return '';
              }
            }
          }
        ),
        veterinaryCouncilRegistrationNo: getLabelWithValue(
          {
            labelName: "Veterinary Council Registration No.",
            labelKey: "NOC_VETERINARY_COUNCIL_REG_NO"
          },
          {
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let veterinaryCouncilRegistrationNo = JSON.parse(value).hasOwnProperty('veterinaryCouncilRegistrationNo')?JSON.parse(value)['veterinaryCouncilRegistrationNo']:'';
              return veterinaryCouncilRegistrationNo;
              }else{
                return '';
              }
            }
          }
        ),
        contactDetail: getLabelWithValue(
          {
            labelName: "Contact detail",
            labelKey: "NOC_CONTACT_DETAIL"
          },
          {
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let immunizationContactDetail = JSON.parse(value).hasOwnProperty('immunizationContactDetail')?JSON.parse(value)['immunizationContactDetail']:'';
              return immunizationContactDetail;
              }else{
                return '';
              }
            }
          }
        ),
        houseNo: getLabelWithValue(
          {
            labelName: "House/Clinic No.",
            labelKey: "NOC_HOUSE_NUMBER"
          },
          {
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let immunizationClinicNo = JSON.parse(value).hasOwnProperty('immunizationClinicNo')?JSON.parse(value)['immunizationClinicNo']:'';
              return immunizationClinicNo;
              }else{
                return '';
              }
            }
          }
        ),
        sector: getLabelWithValue(
          {
            labelName: "Sector",
            labelKey: "NOC_SECTOR"
          },
          {
            jsonPath: "nocApplicationDetail[0].applicationdetail",
            callBack: value => {
              if(value!=undefined){
              let immunizationSector = JSON.parse(value).hasOwnProperty('immunizationSector')?JSON.parse(value)['immunizationSector']:'';
              return immunizationSector;
              }else{
                return '';
              }
            }
          }
        )
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "nocApplicationDetail",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const propertyLocationDetails = getCommonGrayCard({
  propertyLocationContainer: getCommonContainer({
    propertyId: getLabelWithValue(
      {
        labelName: "Property ID",
        labelKey: "NOC_PROPERTY_ID_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.propertyId" }
    ),
    city: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "NOC_PROPERTY_CITY_LABEL"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        }
      }
    ),
    doorHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "NOC_SUMMARY_PROPERTY__LOCATION_DOOR_HOUSE_NO_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    buildingCompanyName: getLabelWithValue(
      {
        labelName: "Building/Company Name",
        labelKey: "NOC_PROPERTY_DETAILS_BLDG_NAME_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.buildingName"
      }
    ),
    streetName: getLabelWithValue(
      {
        labelName: "Street Name",
        labelKey: "NOC_PROPERTY_DETAILS_SRT_NAME_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.street" }
    ),
    mohalla: getLabelWithValue(
      {
        labelName: "Mohalla",
        labelKey: "NOC_PROPERTY_DETAILS_MOHALLA_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.locality.code",
        callBack: value => {
          return `${getTransformedLocale(tenantId)}_REVENUE_${value}`;
        }
      }
    ),
    pincode: getLabelWithValue(
      {
        labelName: "Pincode",
        labelKey: "NOC_PROPERTY_DETAILS_PIN_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.pincode" }
    ),
    locationOnMap: getLabelWithValue(
      {
        labelName: "Location On Map",
        labelKey: "NOC_PROPERTY_DETAILS_GIS_CORD_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.locality.latitude"
      }
    ),
    applicableFireStation: getLabelWithValue(
      {
        labelName: "Applicable Fire Station",
        labelKey: "NOC_PROPERTY_DETAILS_FIRESTATION_LABEL"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.firestationId",
        localePrefix: {
          moduleName: "firenoc",
          masterName: "FireStations"
        }
      }
    )
  })
});

export const propertySummary = getCommonGrayCard({
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
        ...getCommonSubHeader({
          labelName: "Property Details",
          labelKey: "NOC_COMMON_PROPERTY_DETAILS"
        })
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
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  // propertyDetailsHeader: getHeader("Property Details"),
  // break: getBreak(),
  cardOne: propertyDetails
  // propertyLocationDetailsHeader: getHeader("Property Location Details"),
  // cardTwo: propertyLocationDetails
});
