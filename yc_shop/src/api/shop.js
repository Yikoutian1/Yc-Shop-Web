import request from "@/utils/request";

export function shopInfoAdd(info) {
  return request({
    url: "/shop/addShopInfo",
    method: "post",
    data: info,
  });
}

export function getShopListByPageInfo(info) {
  return request({
    url: "/shop/getShopListByPageInfo",
    method: "post",
    data: info,
  });
}
export function searchByName(info) {
  return request({
    url: "/shop/searchByName",
    method: "get",
    params: {
      name: info,
    },
  });
}
export function getImgById(info) {
  return request({
    url: "/shop/getImgById",
    method: "get",
    params: {
      id: info,
    },
  });
}
export function saveShop(info) {
  return request({
    url: "/shop/saveShop",
    method: "post",
    id: info,
  });
}
export function delShopBatchByIds(info) {
  return request({
    url: "/shop",
    method: "delete",
    ids: info,
  });
}
export function selectShopByCategoryBackend(info) {
  return request({
    url: "/shop/selectShopByCategory",
    method: "get",
    params: {
      id: info,
    },
  });
}
export function changeShopStatusBatch(info) {
  return request({
    url: "/shop/changeShopStatusBatch",
    method: "post",
    data: info,
  });
}
