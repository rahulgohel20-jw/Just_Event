import { POST, GET, PUT, DELETE } from "./axiosInstance";

// Create Role
export const createRole = (data) => {
  return POST("/role_master/save-single-or-multiple", data);
};

// Get All Roles
export const getAllRoles = (data) => {
  return GET("/role_master", data);
};

// Update Role
export const updateRole = (roleId, data) => {
  return PUT(`/role_master/update-by-id/${roleId}/role_id`, data);
};

// Delete Role
export const deleteRole = (roleId) => {
  return DELETE(`/role_master/${roleId}/role_id`);
};

export const Translateapi = (data) => {
  return GET(`/transliterate?text=${data}`);
};


export const addupadtetaxmaster = ( data) => {
  return POST(`/tax-master/add-update`,data) ;
} ;

export const deletetaxmaster = (id)  => {
  return DELETE(`/tax-master/delete?id=${id}`);
};

export const getbyidtaxmaster = (id) => {
  return GET(`/tax-master/get?id=${id}`);
};

export const getalltaxmaster = (data) =>{
  return POST(`/tax-master/list`,data) ;
};  

export const addupadtecategorytypemaster = (data) =>{
  return POST(`/category-type/add-update`, data) ;
};

export const deletecategorytypemaster = (id) =>{
  return DELETE (`/category-type/delete?id=${id}`);
};

export const getAllCategoryTypemaster = (data) => {
  return GET (`/category-type/list`,data) ;
};