
import { NOCApplication, NOCCalendar } from "./checkAvailabilityForm_oswmcc";

import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { getCommonContainer, getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";



const getMdmsData = async (action, state, dispatch) => {

  try {
    let payload = {};

    payload.sector = [
      { id: 1, code: 'SECTOR-17', tenantId: 'ch.chandigarh', name: 'SECTOR-17', active: true },
      { id: 2, code: 'EG_SECTOR_34', tenantId: 'ch.chandigarh', name: 'EG_SECTOR_34', active: true },
      { id: 2, code: 'MANIMAJRA', tenantId: 'ch.chandigarh', name: 'MANIMAJRA', active: true }
    ]
    payload.locationsWithinSector = []
  //   payload.locationsWithinSector = [
  //     { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
  //     { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
  //     { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
  // ];
    




    dispatch(prepareFinalObject("calendarScreenMdmsData", payload));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "checkavailability_oswmcc",
  beforeInitScreen: (action, state, dispatch) => {
    getMdmsData(action, state, dispatch).then(response => {

    });
    dispatch(prepareFinalObject("bookingCalendar.moduleName", "Calendar"));
    dispatch(prepareFinalObject("bookingCalendar.sector", ""));
    dispatch(prepareFinalObject("bookingCalendar.toDateToDisplay", ""));
    dispatch(prepareFinalObject("bookingCalendar.fromDateToDisplay", ""));
    dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
    const sectorWiselocationsObject = {
      "SECTOR-17": [
        { id: 1, code: 'RamLila Ground', tenantId: 'ch.chandigarh', name: 'RamLila_Ground', active: true },
        { id: 2, code: 'Mohalla RamKishan', tenantId: 'ch.chandigarh', name: 'Mohalla_RamKishan', active: true },
        { id: 2, code: 'Guard Enclave', tenantId: 'ch.chandigarh', name: 'Guard_Enclave', active: true }
      ],
      "EG_SECTOR_34": [
        { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
        { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
        { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
      ],
      "MANIMAJRA": [
        { id: 1, code: 'kakrala', tenantId: 'ch.chandigarh', name: 'kakrala', active: true },
        { id: 2, code: 'Buldapur', tenantId: 'ch.chandigarh', name: 'Buldapur', active: true },
        { id: 2, code: 'Ithera', tenantId: 'ch.chandigarh', name: 'Ithera', active: true }
      ]
    }
    dispatch(prepareFinalObject("sectorWiselocationsObject", sectorWiselocationsObject));
    
    return action;
  },
  components: {


    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        NOCApplication,
        NOCCalendar
      }
    }
  },
};


export default screenConfig;
