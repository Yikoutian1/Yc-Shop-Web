<template>
  <div class="dashboard-container">
    <p style="text-align: center; font-size: 34px">
      {{ new Date().getFullYear() }}年 商品数据统计页
    </p>
    <div>
      <el-select
        size="small"
        style="margin-top: 4%; margin-left: 200px; width: 80px"
        class="drop_down_list color_search"
        v-model="value"
        @change="SelectChange(value)"
      >
        <template v-for="item in selectMonth">
          <el-option :key="item" :value="item" :label="item"> </el-option>
        </template>
      </el-select>
      <div
        id="echart"
        style="
          width: 1000px;
          height: 700px;
          margin-left: 100px;
          margin-right: 100px;
        "
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; // 引入echarts
import * as echarts from "echarts"; // 在import的后面，echarts的前面加一个 * as
import { searchSales } from "@/api/dashboard";
import { searchOrders } from "@/api/dashboard";
export default {
  name: "Dashboard",
  data() {
    return {
      selectMonth: [], // 当年截至到目前的月份
      value: new Date().getMonth() + 1 + " 月", // 当前月份
      changeMonth: new Date().getMonth() + 1, //onchange事件改变的月份
      changeMonthDays: 31, //改变的月份的天数
      datas: [],
      sales: [
        509, 917, 2455, 2610, 2719, 3033, 3044, 3085, 2708, 2809, 2117, 2000,
        1455, 1210, 719, 733, 944, 2285, 2208, 3372, 3936, 3693, 2962, 2810,
        3519, 2455, 2610, 2719, 2484, 2078,
      ], // 销售额
      orders: [
        2136, 3693, 2962, 3810, 3519, 3484, 3915, 3823, 3455, 4310, 4019, 3433,
        3544, 3885, 4208, 3372, 3484, 3915, 3748, 3675, 4009, 4433, 3544, 3285,
        4208, 3372, 3484, 3915, 3823, 4265, 4298,
      ], // 订单额
    };
  },
  mounted() {
    this.getThisYearMonth();
    this.echar();
    searchSales(this.changeMonth).then((res) => {
      if (res.code === 200) {
        this.sales = [];
        res.data.forEach((item) => {
          this.sales.push(parseFloat(item.totalPrice));
        });
      }
    });
    searchOrders(this.changeMonth).then((res) => {
      if (res.code === 200) {
        this.orders = [];
        res.data.forEach((item) => {
          this.orders.push(parseInt(item.num));
        });
      }
    });
  },
  methods: {
    /**
     * @param {月} month
     */
    async SelectChange(month) {
      this.changeMonth = month;
      // 获取选中的月份的天数
      this.changeMonthDays = this.getThisMonthDays(
        new Date().getFullYear(),
        this.changeMonth.split("")[0]
      );
      // 向后端发送请求,拿数据
      await searchSales(parseInt(this.changeMonth.split("")[0])).then((res) => {
        if (res.code === 200) {
          this.sales = [];
          res.data.forEach((item) => {
            this.sales.push(item.totalPrice);
          });
        }
      });
      await searchOrders(parseInt(this.changeMonth.split("")[0])).then((res) => {
        if (res.code === 200) {
          this.orders = [];
          res.data.forEach((item) => {
            this.orders.push(item.num);
          });
        }
      });
      // 渲染图表
      this.echar();
    },
    getThisYearMonth() {
      for (let i = 1; i <= new Date().getMonth() + 1; i++) {
        this.selectMonth.push(i + " 月");
      }
    },
    // 获取指定月的天数
    getThisMonthDays(year, month) {
      const thisDate = new Date(year, month, 0); //当天数为0 js自动处理为上一月的最后一天
      return thisDate.getDate();
    },
    echar() {
      var myChart = echarts.init(document.getElementById("echart"));
      this.datas = [];
      var xData = (() => {
        // 渲染底下的日期
        for (var i = 1; i <= this.changeMonthDays; i++) {
          this.datas.push(i + "日");
        }
        return this.datas;
      })();
      var option = {
        backgroundColor: "#FFFFFF",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#000000",
            },
          },
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: "#000000",
          },
        },
        legend: {
          x: "46%",
          top: "11%",
          textStyle: {
            color: "#000000",
          },
          data: ["销售额", "订单量"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#000000",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#000000",
              },
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,

            start: 0,
            end: 100,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#5B3AAE",
            },
            textStyle: {
              color: "rgba(204,187,225,0.5)",
            },
            fillerColor: "rgba(67,55,160,0.4)",
            borderColor: "rgba(204,187,225,0.5)",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "销售额",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              color: "#6f7de3",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                {
                  type: "min",
                  name: "最小值",
                },
              ],
            },
            data: this.sales,
          },
          {
            name: "订单量",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              color: "#c257F6",
            },
            markPoint: {
              label: {
                normal: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                {
                  type: "min",
                  name: "最小值",
                },
              ],
            },
            data: this.orders,
          },
        ],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    datas() {
      // 渲染底下的日期
      setTimeout(() => {
        for (var i = 1; i <= this.changeMonthDays; i++) {
          this.datas.push(i + "日");
        }
      }, 1000 * 2);
    },
  },
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  &-container {
    width: 100%;
    height: 100%;
    margin: 30px;
    background-color: #1a1835;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
