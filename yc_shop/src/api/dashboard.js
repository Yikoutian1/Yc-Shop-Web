import request from "@/utils/request";

export function searchSales(info) {
  return request({
    url: "/orders/searchSales",
    method: "get",
    params: {
      month: info,
    },
  });
}
export function searchOrders(info) {
  return request({
    url: "/orderDetail/searchOrders",
    method: "get",
    params: {
      month: info,
    },
  });
}
