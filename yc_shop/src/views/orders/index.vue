<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList">
        <el-table-column label="序号" prop="id" width="50"></el-table-column>
        <el-table-column label="订单编号" prop="oid"></el-table-column>
        <el-table-column label="交易号" prop="payId"></el-table-column>
        <el-table-column label="是否付款" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">待付款</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 1"
              >待发货</el-tag
            >
            <el-tag type="primary" v-else-if="scope.row.status === 2"
              >已发货</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status === 3"
              >已收货</el-tag
            >
            <el-tag type="info" v-else>取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="showBox"
            ></el-button>
            <el-button
              icon="el-icon-location"
              size="mini"
              type="success"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 内容主体区域 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { orderAllList } from "@/api/orders";
export default {
  data() {
    return {
      orderList:[],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      cityData: [],
      progressVisible: false,
      // Add other data properties here
    };
  },
  methods: {
    qeuryOrderList() {
      orderAllList().then((res) => {
        this.orderList = res.data;
      });
    },
    showBox() {
      // Method to show the edit dialog
    },
    showProgressBox() {
      // Method to show the progress dialog
    },
    handleSizeChange(newSize) {
      // Method to handle page size change in pagination
    },
    handleCurrentChange(newPage) {
      // Method to handle current page change in pagination
    },
    addressDialogClosed() {
      // Method to handle address dialog close event
    },
    // Add other methods here
  },
  mounted(){
    this.qeuryOrderList()
  },
  filters: {
    dateFormat(value) {
      // Example filter to format date
      // You should implement the actual date formatting logic here
      return value;
    },
    // Add other filters here
  },
};
</script>

<style lang="scss"></style>
