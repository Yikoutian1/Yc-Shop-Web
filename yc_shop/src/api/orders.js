import request from "@/utils/request";

export function orderAllList(pageNum,pageSize,status) {
  return request({
    url: "/orders/getAllOrder",
    method: "get",
    params:{
      pageNum:pageNum,
      pageSize:pageSize,
      status:status
    }
  });
}
export function getOrderDetailInfo() {
  return request({
    url: "/orders/getOrderDetailInfo",
    method: "get",
  });
}
export function queryOrderList(pageNum,pageSize,input) {
  return request({
    url: "/orders/queryOrderList",
    method: "get",
    params:{
      pageNum:pageNum,
      pageSize:pageSize,
      input:input
    }
  });
}
export function changStatus(status, id) {
  return request({
    url: "/orders/changStatus",
    method: "get",
    params:{
      status:status,
      id:id,
    }
  });
}
