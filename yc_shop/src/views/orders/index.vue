<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8" @keyup.enter.native="query">
          <el-input
            v-model.number="input"
            class="search"
            placeholder="请输入内容"
          >
            <el-button
              @click="query"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="订单编号" prop="oid"></el-table-column>
        <el-table-column label="交易号" prop="payId"></el-table-column>
        <el-table-column label="订单状态" prop="status" width="120">
          <template slot="header">
            <el-dropdown @command="(command) => handleCommand(command)">
              <p class="orderstatus">
                订单状态<i class="el-icon-arrow-down el-icon--right"></i>
              </p>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">待付款</el-dropdown-item>
                <el-dropdown-item command="1">待发货</el-dropdown-item>
                <el-dropdown-item command="2">已发货</el-dropdown-item>
                <el-dropdown-item command="3">已收货</el-dropdown-item>
                <el-dropdown-item command="4">取消</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag
              style="
                margin-right: 3px;
                margin-left: 3px;
                color: rgb(66, 62, 62);
                background-color: #f4f4f5;
                border-color: #e9e9eb;
              "
              v-if="scope.row.status === 0"
              >待付款</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.status === 1"
              >待发货</el-tag
            >
            <el-tag type="primary" v-else-if="scope.row.status === 2"
              >已发货</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status === 3"
              >已收货</el-tag
            >
            <el-tag
              class="afterChange"
              :class="{ changeColor: scope.row.payTime == null }"
              v-else
              >取消</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="支付时间" prop="createTime">
          <template slot-scope="scope">
            <div v-if="scope.row.payTime != null">{{ scope.row.payTime }}</div>
            <div v-else>暂未支付</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="click" content="内容">
              <el-tag
                v-if="scope.row.status != 0"
                style="
                  margin-right: 3px;
                  margin-left: 3px;
                  color: rgb(66, 62, 62);
                  background-color: #f4f4f5;
                  border-color: #e9e9eb;
                "
                @click="changeStatus(0, scope.row)"
                >待付款</el-tag
              >
              <el-tag
                v-if="scope.row.status != 1"
                class="tag"
                @click="changeStatus(1, scope.row)"
                type="warning"
                >待发货</el-tag
              >
              <el-tag
                v-if="scope.row.status != 2"
                class="tag"
                @click="changeStatus(2, scope.row)"
                type="primary"
                >已发货</el-tag
              >
              <el-tag
                v-if="scope.row.status != 3"
                class="tag"
                @click="changeStatus(3, scope.row)"
                type="success"
                >已收货</el-tag
              >
              <el-tag
                v-if="scope.row.status != 4"
                class="tag"
                @click="changeStatus(4, scope.row)"
                type="info"
                >取消</el-tag
              >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                slot="reference"
                style="margin-right: 10px"
                >修改</el-button
              >
            </el-popover>
            <el-button
              icon="el-icon-reading"
              size="mini"
              type="success"
              @click="showProgressBox(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPageNum"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <el-drawer
      size="65%"
      title="订单明细"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div class="order-details">
        <el-card>
          <div class="order-header">
            <span>订单编号:{{ headInfo.oid }}</span>
          </div>
          <el-divider></el-divider>
          <div class="order-info">
            <div class="order-status">
              <h3>
                订单状态:
                <el-tag size="medium" v-if="headInfo.status === 0"
                  >待付款</el-tag
                >
                <el-tag
                  style="font-size: 16px"
                  type="warning"
                  v-else-if="headInfo.status === 1"
                  >待发货</el-tag
                >
                <el-tag
                  size="medium"
                  type="primary"
                  v-else-if="headInfo.status === 2"
                  >已发货</el-tag
                >
                <el-tag
                  size="medium"
                  type="success"
                  v-else-if="headInfo.status === 3"
                  >已收货</el-tag
                >
                <el-tag size="small" type="danger" v-else>取消</el-tag>
              </h3>
            </div>
            <div class="order-date">
              <h3>订单创建日期:{{ headInfo.createTime }}</h3>
            </div>
            <div class="order-date">
              <h3 v-if="headInfo.payTime != null">
                付款日期:{{ headInfo.payTime }}
              </h3>
              <h3 v-else>订单操作:已取消</h3>
            </div>
            <div class="order-total">
              <h3>总金额: {{ headInfo.totalPrice }} 元</h3>
            </div>
          </div>
          <el-divider> </el-divider>
          <div class="order-items">
            <h3>商品列表:</h3>
            <el-table :data="showProgressList" border>
              <el-table-column prop="username" label="用户名">
              </el-table-column>
              <el-table-column prop="name" label="商品名称"></el-table-column>
              <el-table-column label="图片" width="110px;">
                <template slot-scope="scope">
                  <el-popover placement="right" trigger="hover">
                    <img
                      :src="scope.row.image"
                      style="max-width: 250px; max-height: 250px"
                    />
                    <img
                      slot="reference"
                      :src="scope.row.image"
                      style="
                        width: 90px;
                        height: 90px;
                        vertical-align: middle;
                        text-align: center;
                      "
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
                label="商品数量"
                width="60"
              ></el-table-column>
              <el-table-column prop="price" label="商品价格"></el-table-column>
              <el-table-column
                prop="address"
                label="收货地址"
              ></el-table-column>
              <el-table-column prop="phone" label="电话"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { orderAllList } from "@/api/orders";
import { getOrderDetailInfo } from "@/api/orders";
import { queryOrderList } from "@/api/orders";
import { changStatus } from "@/api/orders";
export default {
  data() {
    return {
      input: "", //搜索内容
      orderList: [], // 订单
      drawer: false,
      direction: "rtl", // 右往左抽屉
      total: 0, // 列表数
      currentPageNum: 1, //当前页码
      currentPageSize: 20, // 当前分页大小
      showProgressList: [], // 当前选择物流的抽屉信息
      orderDetail: [], //所有的订单明细
      headInfo: [], // 抽屉头部信息
      uselessStatus: 201, // 后端约定不需要查分类时
    };
  },
  methods: {
    changeStatus(status, row) {
      changStatus(status, row.id)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.qeuryOrderList();
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "修改失败",
            type: "error",
          });
        });
    },
    /**
     * 分页+筛选
     */
    qeuryOrderList() {
      this.orderList = [];
      orderAllList(this.currentPageNum, this.currentPageSize, 201).then(
        (res) => {
          this.orderList = res.data.row;
          this.total = parseInt(res.data.total);
        }
      );
    },
    orderDetailInfo() {
      this.orderDetail = [];
      getOrderDetailInfo().then((res) => {
        this.orderDetail = res.data;
      });
    },
    edit(row) {
      console.log(row);
    },
    showProgressBox(row) {
      this.headInfo.status = row.status;
      this.headInfo.totalPrice = row.totalPrice;
      this.headInfo.payTime = row.payTime;
      this.headInfo.oid = row.oid;
      this.headInfo.createTime = row.createTime;
      this.showProgressList = this.orderDetail.filter((item) => {
        return item.oid == row.oid;
      });
      this.drawer = true;
    },
    handleCommand(command) {
      // 选择筛选的值
      this.orderList = [];
      orderAllList(this.currentPageNum, this.currentPageSize, command).then(
        (res) => {
          this.orderList = res.data.row;
          this.total = parseInt(res.data.total);
        }
      );
    },
    handleSizeChange(newSize) {
      this.currentPageSize = newSize;
      orderAllList(this.currentPageNum, this.currentPageSize, 201).then(
        (res) => {
          this.orderList = res.data.row;
          this.total = parseInt(res.data.total);
        }
      );
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      orderAllList(this.currentPageNum, this.currentPageSize, 201).then(
        (res) => {
          this.orderList = res.data.row;
          this.total = parseInt(res.data.total);
        }
      );
    },
    query() {
      queryOrderList(
        this.currentPageNum,
        this.currentPageSize,
        this.input
      ).then((res) => {
        this.orderList = res.data.row;
        this.total = parseInt(res.data.total);
      });
      this.input = "";
    },
    handleClose() {
      this.showProgressList = [];
      this.drawer = false;
    },
  },
  mounted() {
    this.qeuryOrderList();
    this.orderDetailInfo();
  },
  computed: {},
};
</script>

<style>
.el-pagination {
  text-align: center;
  margin-top: 3%;
}
.el-tag,
.el-table {
  font-size: 16px;
}
.search {
  width: 170px;
  transition: width 0.3s ease; /* 添加过渡属性 */
  overflow: hidden; /* 隐藏溢出内容，使过渡看起来更平滑 */
}
.search:hover {
  width: 380px;
}
.orderstatus {
  color: #909399;
  font-size: 16px;
}
.tag {
  margin-right: 3px;
  margin-left: 3px;
}

.afterChange {
  background-color: #ffdcef;
  border-color: #e9e9eb;
  color: red;
}
.changeColor {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
.pay {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: red;
}
</style>
