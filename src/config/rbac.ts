import { ROLES } from "../constants/roles";
import { PERMISSIONS } from "../constants/permissions";

export const ROLE_PERMISSIONS:Record<string,string[]>={
    [ROLES.ADMIN]:[
         PERMISSIONS.INVITE_AUTHOR, 
         PERMISSIONS.PUBLISH_POST,
         PERMISSIONS.DELETE_POST,
         PERMISSIONS.CREATE_POST,
         PERMISSIONS.EDIT_OWN_POST,
         PERMISSIONS.VIEW_AUDIT_LOG,
  
    ],
    [ROLES.AUTHOR]:[
        PERMISSIONS.CREATE_POST,
        PERMISSIONS.EDIT_OWN_POST,
    ],
}