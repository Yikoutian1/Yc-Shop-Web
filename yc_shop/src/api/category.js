import request from "@/utils/request";

export function updateCategoryInfo(info) {
  return request({
    url: "/category/updateCategoryInfo",
    method: "post",
    data: info,
  });
}
export function getCategoryList() {
  return request({
    url: "/category/getCategoryList",
    method: "get",
  });
}
export function getCategoryAllList() {
  return request({
    url: "/category/getCategoryAllList",
    method: "get",
  });
}
export function byNameFindCategoryId(info) {
  return request({
    url: "/category/byNameFindCategoryId",
    method: "get",
    params: {
      name: info
    }
  });
}

export function byCategoryIdFindName(info) {
  return request({
    url: "/category/byCategoryIdFindName",
    method: "get",
    params: {
      id: info
    }
  });
}

export function queryPage(info) {
  return request({
    url: "/category/queryPage",
    method: "post",
    data: info,
  });
}
export function searchCategory(info) {
  return request({
    url: "/category/searchCategory",
    method: "get",
    params: {
      name: info
    }
  });
}
export function changeCategoryStatusBatch(info) {
  return request({
    url: "/category/changeCategoryStatusBatch",
    method: "post",
    data: info,
  });
}

export function delBatchByIds(info) {
  return request({
    url: "/category",
    method: "delete",
    data: info,
  });
}
export function addCategoryInfo(info) {
  return request({
    url: "/category/addCategoryInfo",
    method: "post",
    data: info,
  });
}
