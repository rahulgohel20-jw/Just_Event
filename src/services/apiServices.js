import axiosInstance, { POST, GET, PUT, DELETE } from "./axiosInstance";
import { data } from "autoprefixer";

// Sign Up Login 
export const signup = (data) => {
    return POST(`/auth/signup`, data);
};

export const login = (data) => {
    return POST(`/auth/login`, data);
};


// translate
export const Translateapi = (data) => {
    return GET(`/transliterate?text=${data}`);
};


// city state 
export const getstatebycountry = (data) => {
    return POST(`/state/list`, data);
};

export const getbycitiesbystate = (data) => {
    return POST(`/city/list`, data);
};


// Create Role
export const createRole = (data) => {
    return POST("/role_master/save-single-or-multiple", data);
};

export const getAllRoles = (data) => {
    return GET("/role_master", data);
};

export const updateRole = (roleId, data) => {
    return PUT(`/role_master/update-by-id/${roleId}/role_id`, data);
};

export const deleteRole = (roleId) => {
    return DELETE(`/role_master/${roleId}/role_id`);
}


// Tax 
export const addupadtetaxmaster = (data) => {
    return POST(`/tax-master/add-update`, data);
};

export const deletetaxmaster = (id) => {
    return DELETE(`/tax-master/delete?id=${id}`);
};

export const getbyidtaxmaster = (id) => {
    return GET(`/tax-master/get?id=${id}`);
};

export const getalltaxmaster = (data) => {
    return POST(`/tax-master/list`, data);
};


// category type master
export const addupadtecategorytypemaster = (data) => {
    return POST(`/category-type/add-update`, data);
};

export const deletecategorytypemaster = (id) => {
    return DELETE(`/category-type/delete?id=${id}`);
};

export const getAllCategoryTypemaster = (data) => {
    return POST(`/category-type/list`, data);
};
export const getAllEventTypemaster = (data) => {
    return POST(`/event-type/list`, data);
};

export const addupadteeventtypemaster = (data) => {
    return POST(`/event-type/add-update`, data);
};

// cat
export const addupdatecategorymaster = (data) => {
    return POST(`/category-master/add-update`, data);
};

export const deletecategorymaster = (id) => {
    return DELETE(`/category-master/delete?id=${id}`);
};

export const getAllCategoryMaster = (data) => {
    return POST(`/category-master/list`, data);
};


// rawcattype
export const addupdaterawcategorytype = (data) => {
    return POST(`/raw-category-type/add-update`, data);
};

export const deleterawcategorytype = (id) => {
    return DELETE(`/raw-category-type/delete?id=${id}`);
};

export const getbyidrawcategorytype = (id) => {
    return GET(`/raw-category-type/get?id=${id}`);
};

export const getAllRawCategoryTypeMaster = (data) => {
    return POST(`/raw-category-type/list`, data);
};


// rawcat
export const addupdaterawcategory = (data) => {
    return POST(`/raw-category/add-update`, data);
};

export const deleterawcategory = (id) => {
    return DELETE(`/raw-category/delete?id=${id}`);
};

export const getbyidrawcategory = (id) => {
    return GET(`/raw-category/get?id=${id}`);
};

export const getAllRawCategoryMaster = (data) => {
    return POST(`/raw-category/list`, data);
};

// raw sub cat
export const addupdaterawsubcategory = (data) => {
    return POST(`/raw-sub-category/add-update`, data);
};

export const deleterawsubcategory = (id) => {
    return DELETE(`/raw-sub-category/delete?id=${id}`);
};

export const getbyidrawsubcategory = (id) => {
    return GET(`/raw-sub-category/get?id=${id}`);
};

export const getAllRawSubCategoryMaster = (data) => {
    return POST(`/raw-sub-category/list`, data);
};

// raw item 
export const addupdaterawitem = (data) => {
    return POST(`/raw-item/add-update`, data);
};

export const deleterawitem = (id) => {
    return DELETE(`/raw-item/delete?id=${id}`);
};

export const getbyidrawitem = (id) => {
    return GET(`/raw-item/get?id=${id}`);
};

export const getAllRawItemMaster = (data) => {
    return POST(`/raw-item/list`, data);
};

// unit
export const addupdateunitmaster = (data) => {
    return POST(`/unit-master/add-update`, data);
};

export const deleteunitmaster = (id) => {
    return DELETE(`/unit-master/delete?id=${id}`);
};

export const getbyidunitmaster = (id) => {
    return GET(`/unit-master/get?id=${id}`);
};

export const getAllUnitMaster = (data) => {
    return POST(`/unit-master/list`, data);
};

//role master api
export const getallrolemaster = (payload) => {
    return POST("/role/list", payload);
};
export const addupdaterolemaster = (payload) => {
    return POST("/role/add-update", payload);
};

export const getbyidrolemaster = (id) => {
    return GET(`/role/get/?id=${id}`);
};

export const deleterolemaster = (id) => {
    return DELETE(`/role/delete/?id=${id}`);
};

// Client /vendor API
export const addupdateclientmaster = (formData) => {
    return axiosInstance.post("/party-master/add-update", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllClientMaster = (data) => {
    return POST("/party-master/list", data);
};
export const getClientById = (id) => {
    return GET(`/party-master/get?id=${id}`);
};
export const deleteClientMaster = (id) => {
    return DELETE(`/party-master/delete?id=${id}`);
};

export const generateUniqueCodeforvendor = (userId) => {
    return GET(`party-master/generate-unique-code?userId=${userId}`);
};


// function master
export const addupadtefunctionmaster = (formData) => {
    return POST(`/function/add-update`, formData);
};

export const getalllistfuntionmaster = (data) => {
    return POST(`/function/list`, data);
};

export const deletefunctionmaster = (id) => {
    return DELETE(`/function/delete?id=${id}`);
};


// plan
export const addupdateplan = (data) => {
    return POST(`/plan/add-update`, data);

};

export const getAllPlanMaster = (data) => {
    return POST(`/plan/list`, data);

};

export const deleteplan = (id) => {
    return DELETE(`/plan/delete?id=${id}`);
};

export const getbyidplan = (id) => {
    return GET(`/paln/get?id=${id}`);
};