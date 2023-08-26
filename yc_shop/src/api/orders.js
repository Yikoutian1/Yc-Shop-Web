import request from "@/utils/request";

export function orderAllList() {
  return request({
    url: "/orders/getAllOrder",
    method: "get",
  });
}