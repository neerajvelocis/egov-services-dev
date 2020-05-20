export const baseURL = window.location.origin;
export const Global_var = {

  // GET NOC DATA
  // 'http://192.168.12.116:8010/egov-opmsService/noc/_get'
  // URL_GETNOC: 'http://192.168.12.115:8009/egov-opmsService/noc/_get',
  // URL_ADDNOC: 'http://192.168.12.115:8009/egov-opmsService/noc/_createJson?status=INITIATE',
  // BASEURL: 'http://192.168.12.116:8096/egov-mdms-service/v1/_get?moduleName=egpm&tenantId=ch&',
  // FILE_UPLOAD: 'http://192.168.12.124:8083/filestore/v1/files',
  // URL_GETJSONDATA: ''
  // URL_GETNOC: 'http://192.168.12.123:30043/egov-opmsService/noc/_get',
  // URL_ADDNOC: 'http://192.168.12.123:30043/egov-opmsService/noc/_createJson?status=INITIATE',
  // BASEURL: 'http://192.168.12.123:30043/egov-mdms-service/v1/_get?moduleName=egpm&tenantId=ch&',
  // FILE_UPLOAD: 'http://192.168.12.123:30043/filestore/v1/files',

  //http://localhost:8008/egov-opmsService/noc/_get

  // 'http://192.168.12.116:8010/egov-opmsService/noc/_get'

  /***********SIT *********************/

  // URL_GETNOC: 'http://192.168.12.124:8096/egov-opmsService/noc/_get',
  // URL_ADDNOC: 'http://192.168.12.124:8096/egov-opmsService/noc/_createJson',
  // BASEURL: 'http://192.168.12.124:8096/egov-mdms-service/v1/_get?moduleName=egpm&tenantId=ch&',
  // URL_JSON: 'http://192.168.12.124:8096/egov-opmsService/noc/_getcolumnsmodules?noctype=PETNOC',
  // URL_VIEW: 'http://192.168.12.124:8096/egov-opmsService/noc/_view',
  // URL_UPDATESTATUS: 'http://192.168.12.124:8096/egov-opmsService/noc/_updateappstatus',
  // URL_POPUPDATA: 'http://192.168.12.115:8009/egov-opmsService/noc/_getcolumnsremarks'

  /***************LOcal *****************/

  // URL_GETNOC: 'http://192.168.12.116:8010/pm-services/noc/_get',
  // URL_ADDNOC: 'http://192.168.12.116:8010/pm-services/noc/_create',
  // BASEURL: 'http://192.168.12.116:8096/egov-mdms-service/v1/_get?moduleName=egpm&tenantId=ch&',
  // URL_JSON: 'http://192.168.12.116:8009/pm-services/noc/_getcolumnsmodules?noctype=',
  // URL_VIEW: '/pm-services/noc/_view',
  // URL_UPDATESTATUS: '/pm-services/noc/_updateappstatus',
  // URL_POPUPDATA: '/pm-services/noc/_getcolumnsremarks',
  // URL_FILEUPLOAD: 'http://192.168.12.124:8083/filestore/v1/files',
  // URL_FILEDOWNLOAD: 'http://192.168.12.124:8083/filestore/v1/files/url?tenantId=ch&fileStoreIds=',
  // URL_UPDATE: 'http://192.168.12.116:8009/pm-services/noc/_update',
  // URL_CARDS : 'http://192.168.12.116:8096/egov-mdms-service/v1/_get?moduleName=egpm&masterName=ApplicationType&tenantId=ch'


 /***************Dev environment *****************/

  URL_GETNOC: baseURL+'/pm-services/noc/_get',
  URL_ADDNOC: baseURL+'/pm-services/noc/_create',
  BASEURL: baseURL+'/egov-mdms-service/v1/_get?moduleName=egpm&tenantId=ch&',
  URL_JSON: baseURL+'/pm-services/noc/_getcolumnsmodules?noctype=',
  URL_VIEW: baseURL+'/pm-services/noc/_view',
  URL_UPDATESTATUS: baseURL+'/pm-services/noc/_updateappstatus',
  URL_POPUPDATA: baseURL+'/pm-services/noc/_getcolumnsremarks',
  URL_FILEUPLOAD: baseURL+'/filestore/v1/files',
  URL_FILEDOWNLOAD: baseURL+'/filestore/v1/files/url?tenantId=ch&fileStoreIds=',
  URL_UPDATE: baseURL+'/pm-services/noc/_update',
  // URL_CARDS : baseURL+ '/egov-mdms-service/v1/_get?moduleName=egpm&masterName=ApplicationType&tenantId=ch'








  //FILE_UPLOAD: 'http://192.168.12.124:8083/filestore/v1/files',
}