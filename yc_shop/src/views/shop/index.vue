<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="input"
        placeholder="请输入商品名称"
        style="width: 200px"
        @keyup.native.enter="handleQuery"
      >
      </el-input>
      <el-button @click="handleQuery" class="el-button-search">搜索</el-button>
      <el-select
        @change="selectShopByCategory"
        v-model="categorySelect"
        placeholder="请选择"
        style="margin-left: 8px; width: 120px"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :value="item.id"
          :label="item.name"
          :disabled="!item.status"
        >
        </el-option>
      </el-select>
      <span class="span-btn delBut non" @click="deleteHandle">批量删除</span>
      <span class="span-btn blueBug non" @click="statusHandle('1')"
        >批量启售</span
      >
      <span
        class="span-btn delBut non"
        style="border: none"
        @click="statusHandle('0')"
        >批量停售</span
      >
      <el-button type="primary" @click="addShop"> + 新增商品 </el-button>
      <el-button @click="reflash"> 刷新商品列表 </el-button>
    </div>
    <el-table :data="shopData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" property="id" label="编号" width="60" />
      <el-table-column property="id" label="编号" width="60" />
      <el-table-column label="图片" width="100px;">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <img
              :src="scope.row.image"
              style="max-width: 250px; max-height: 250px"
            />
            <img
              slot="reference"
              :src="scope.row.image"
              style="width: 50px; height: 50px; vertical-align: middle"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column property="name" label="商品名" width="200" />
      <el-table-column property="category" label="分类" width="120" />
      <el-table-column property="price" label="价格" width="80" />
      <el-table-column property="sales" label="销量" width="80" />
      <el-table-column property="inventory" label="库存" width="80" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <div :class="{ statuschange: scope.row.status == '停售' }">
            {{ scope.row.status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="describle" label="描述" width="300" />
      <el-table-column property="createTime" label="创建时间" width="150" />
      <el-table-column property="updateTime" label="更新时间" width="150" />
      <el-table-column label="操作" width="160" align="center">
        <!-- 修改信息 -->
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="blueBug"
            style="font-size: small"
            @click="updateInfo(scope.row)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div id="pages">
      <el-pagination
        @size-change="sizeChangeQuery"
        @current-change="currentQuery"
        :current-page="currentPageNum"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="20"
        class="pages-class"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisibleForAddShop"
      width="500px"
      :before-close="handleAddShopClose"
    >
      <el-form ref="diaForm" :model="diaForm" :rules="rules" class="dia-form">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model.trim="diaForm.name" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input
            v-model.number="diaForm.price"
            type="number"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品销量">
          <el-input-number
            size="small"
            v-model="diaForm.sales"
            :min="0"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input-number
            size="small"
            v-model="diaForm.inventory"
            :min="0"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="选择分类名称" prop="categoryId">
          <el-select v-model="diaFormCategoryName" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :value="item.name"
              :label="item.name"
              :disabled="!item.status"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-switch
          inactive-text="停售"
          active-text="启售"
          v-model="diaFormStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="启售"
          inactive-value="停售"
        >
        </el-switch>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
          style="margin-top: 10px"
        >
        </el-input>
      </el-form>
      <el-upload
        class="upload-demo"
        action="http://localhost:8080/images/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-change="handleChange"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
        style="margin-top: 10px"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <br />
      <div v-if="this.title == '修改信息'">
        <div
          v-for="(item, index) in diaFormPhotoList"
          :key="index"
          style="border: 1px #bacaff solid; display: flex"
        >
          <div class="img">
            <img :src="item" style="max-width: 80px; max-height: 80px" />
          </div>
          <div style="margin-top: 20px">
            {{ item }}
          </div>
          <div style="margin-right: 6px; margin-top: 3px; cursor: pointer">
            <i @click="removePhoto(item)" class="el-icon-close"></i>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddShopClose">取 消</el-button>
        <el-button
          v-if="this.title == '新增商品'"
          type="primary"
          @click="addConfirm"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click="saveShopH">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览窗口 -->
    <el-dialog :visible.sync="previewVisible" style="">
      <img :src="previewPath" style="width: 100%; height: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryAllList } from "@/api/category";
import { shopInfoAdd } from "@/api/shop";
import { getShopListByPageInfo } from "@/api/shop";
import { searchByName } from "@/api/shop";
import { getImgById } from "@/api/shop";
import { saveShop } from "@/api/shop";
import { byNameFindCategoryId } from "@/api/category";
import { delShopBatchByIds } from "@/api/shop";
import { changeShopStatusBatch } from "@/api/shop";
import { selectShopByCategoryBackend } from "@/api/shop";
import { byCategoryIdFindName } from "@/api/category";

export default {
  data() {
    return {
      title: "商品添加", // 默认为商品添加
      input: "", // 搜索的值
      dialogVisibleForAddShop: false,
      fileList: [], // 照片
      options: [], // 选择的分类
      value: "", // 选择的数据
      diaForm: {}, // 添加的数据
      diaFormCategoryName: "", // 回显的分类名
      textarea: "", // 商品描述内容
      uploadAction: "/images/upload", // 占位符，实际上传操作在后端处理
      previewVisible: false,
      previewPath: "", // url
      diaFormStatus: "启售", // 默认起售
      basePhotoUrl: "http://rzl9bicnx.hn-bkt.clouddn.com/",
      resList: [], // 返回的url集合
      shopData: [], // 商品集合
      diaFormPhotoList: [], // 弹窗照片集合
      searchCateId: 0, // 根据名字查询到的分类id
      updateShopId: 0, // 全局更新商品id
      selectedItems: [], // 选择的行
      selectedIds: [], // 选择的ids
      total: 0,
      currentPageNum: 1, // 默认页码1
      currentPageSize: 20, // 默认一页20个
      categorySelect: "", // 默认筛选为0
      rules: {
        name: [{ required: true, message: "请输入商品名字", trigger: "blur" }],
        diaFormCategoryName: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
        price: [
          {
            required: true,
            message: "请输入价格",
          },
          {
            type: "number",
            message: "输入的价格必须为数字",
          },
          { validator: this.validateDecimal, trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    // 获取选中的数据
    handleSelectionChange(selection) {
      this.selectedItems = selection;
      // console.log(selection)
    },
    // 删除
    deleteHandle() {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.getSelectionIds();
          // console.log(this.selectedIds)
          delShopBatchByIds(this.selectedIds).then((res) => {
            if (res.code === 200) {
              this.queryShopPageList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getSelectionIds() {
      this.selectedIds = [];
      this.selectedItems.forEach((item) => {
        this.selectedIds.push(item.id);
      });
      // console.log(this.selectedIds);
    },
    // 筛选
    selectShopByCategory() {
      // 分类id拿到进行筛选
      // alert(this.categorySelect)
      selectShopByCategoryBackend(this.categorySelect).then((res) => {
        // console.log(res.data);
        this.total = res.data.total;
        this.changeShopDataFormdata(res.data.list, res);
        // url 拼接
        this.shopData.forEach((item) => {
          item.image.split(",").forEach((iitem) => {
            item.image = this.basePhotoUrl + iitem;
          });
          // console.log(item.image);
        });
      });
    },
    async addConfirm() {
      await byNameFindCategoryId(this.diaFormCategoryName).then((res) => {
        this.searchCateId = res.data;
        // console.log("res" + res.data);
        this.diaForm.categoryId = this.searchCateId;
      });
      this.$refs.diaForm.validate((valid) => {
        if (valid) {
          this.resList = this.handleFileList(
            this.fileList,
            this.diaFormPhotoList
          );
          this.diaFormStatus = "启售" == this.diaFormStatus ? 1 : 0;
          let list = {
            name: this.diaForm.name,
            price: this.diaForm.price,
            categoryId: this.diaForm.categoryId,
            describle: this.textarea,
            inventory: this.diaForm.inventory,
            sales: this.diaForm.sales,
            images: this.resList,
            status: this.diaFormStatus,
          };
          // 执行添加操作
          // 调用上传接口
          // console.log(list);
          shopInfoAdd(list)
            .then(() => {
              this.dialogVisibleForAddShop = false;
              this.queryShopPageList();
              this.$message({
                showClose: true,
                message: "上传成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.dialogVisibleForAddShop = false;
              this.$message({
                showClose: true,
                message: "上传失败",
                type: "error",
              });
            });
        } else {
          // 验证失败
          return false;
        }
      });
    }, // 删除照片
    removePhoto(item) {
      this.diaFormPhotoList = this.diaFormPhotoList.filter((i) => i != item);
      // console.log(this.diaFormPhotoList);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log(this.fileList)
    },
    handleFileList(fileList, diaFormPhotoList) {
      let res = [];
      // 假如不是 修改信息时   console.log(diaFormPhotoList.length == 0);  => true
      if (diaFormPhotoList.length == 0) {
        fileList.forEach((item) => {
          // console.log(item)
          let url = item.response.data;
          let back = url.substring(this.basePhotoUrl.length);
          res.push(back);
        });
        // console.log(res)
        return res;
      } else {
        // 是修改信息,那么照片包括俩部分,1:fileList  2:diaFormPhotoList
        fileList.forEach((item) => {
          // console.log(item)
          let url = item.response.data;
          let back = url.substring(this.basePhotoUrl.length);
          res.push(back);
        });
        diaFormPhotoList.forEach((item) => {
          let back = item.substring(this.basePhotoUrl.length);
          res.push(back);
        });
        // console.log(res)
        return res;
      }
    },
    // 修改信息
    updateInfo(row) {
      // console.log(row)
      // byCategoryIdFindName(row.category).then((res) => {
      //   this.diaFormCategoryName = res.data;
      //   console.log(res);
      // });
      this.diaFormCategoryName = row.category;
      byNameFindCategoryId(row.category).then((res) => {
        this.searchCateId = res.data;
        // console.log("res" + res.data);
        this.diaForm.categoryId = this.searchCateId;
      });

      this.diaFormPhotoList = [];
      this.diaForm = {};
      this.title = "修改信息";
      this.dialogVisibleForAddShop = true;
      this.textarea = row.describle;
      this.diaFormStatus = row.status;
      this.diaForm = {
        inventory: row.inventory,
        categoryId: this.searchCateId,
        createTime: row.createTime,
        describle: row.describle,
        categoryName: row.category,
        id: row.id,
        // image: row.image,
        name: row.name,
        price: row.price,
        sales: row.sales,
        status: row.status,
        updateTime: row.updateTime,
      };
      this.updateShopId = row.id;
      console.log(this.diaForm);
      // console.log("id:"+this.updateShopId)
      getImgById(row.id).then((res) => {
        // console.log(row.id)
        res.data.split(",").forEach((item) => {
          item = this.basePhotoUrl + item;
          this.diaFormPhotoList.push(item);
        });
      });
      // console.log(this.diaFormPhotoList);
    },
    async saveShopH() {
      let listCategoryId;
      await byNameFindCategoryId(this.diaFormCategoryName).then((res) => {
        // console.log(res.data)
        listCategoryId = res.data;
      });

      this.$refs.diaForm.validate((valid) => {
        if (valid) {
          this.resList = this.handleFileList(
            this.fileList,
            this.diaFormPhotoList
          );
          this.diaFormStatus = "启售" == this.diaFormStatus ? 1 : 0;
          // console.log("this.form" + this.diaForm)
          if (this.resList.length == 0) {
            this.resList = "empty.png";
          }
          let list = {
            id: this.updateShopId,
            name: this.diaForm.name,
            price: this.diaForm.price,
            inventory: this.diaForm.inventory,
            categoryId: listCategoryId,
            describle: this.textarea,
            sales: this.diaForm.sales,
            images: this.resList,
            status: this.diaFormStatus,
          };
          // 新值  是name
          // console.log("list:" + this.diaFormCategoryName);

          // 执行添加操作
          // 调用上传接口
          // console.log(list);
          saveShop(list)
            .then(() => {
              this.dialogVisibleForAddShop = false;
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success",
              });
              this.queryShopPageList();
            })
            .catch((error) => {
              this.$message({
                showClose: true,
                message: "更新失败",
                type: "error",
              });
              this.dialogVisibleForAddShop = false;
            });
        } else {
          // 验证失败
          return false;
        }
      });
    },
    handlePreview(file) {
      // 预览文件的处理函数
      if (file.raw) {
        this.previewPath = URL.createObjectURL(file.raw); // 设置当前预览图片的 URL
        this.previewVisible = true; // 打开图片预览弹窗
      }
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 搜索
    handleQuery() {
      searchByName(this.input).then((res) => {
        this.shopData = [];
        res.data.forEach((item) => {
          let iimage = item.image.split(",");
          let resu = {
            id: item.id,
            name: item.name,
            price: item.price,
            describle: item.describle,
            inventory: item.inventory,
            sales: item.sales,
            status: item.status == 1 ? "启售" : "停售",
            image: iimage[0],
            createTime: item.createTime,
            updateTime: item.updateTime,
            category: item.categoryName,
          };
          this.shopData.push(resu);
        });
      });
    },
    // 启售:停售 状态更改
    statusHandle(row) {
      let params = {};
      if (typeof row === "string") {
        if (this.selectedItems.length == 0) {
          this.$message.error("批量操作，请先勾选操作分类！");
          return false;
        }
        let idsArr = [];
        this.selectedItems.forEach((item) => {
          idsArr.push(item.id);
        });
        params.ids = idsArr;
        params.status = row;
      } else {
        let idsArr = [];
        idsArr.push(row.id);
        params.ids = idsArr;
        params.status = row.status ? "0" : "1";
      }
      this.$confirm("确认更改该套餐状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // console.log(params);
        // 起售停售---批量起售停售接口
        changeShopStatusBatch(params)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success("状态已经更改成功！");
              this.queryShopPageList();
            } else {
              this.$message.error(res.msg || "操作失败");
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err);
          });
      });
    },
    addShop() {
      this.title = "新增商品";
      this.dialogVisibleForAddShop = true;
    },
    // close dialog
    handleAddShopClose() {
      this.dialogVisibleForAddShop = false;
    },
    validateDecimal(rule, value, callback) {
      if (value !== null && value !== undefined) {
        const decimalRegex = /^\d+(\.\d{1,2})?$/;
        if (!decimalRegex.test(value)) {
          callback(new Error("小数位数不能超过两位"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    currentQuery(page) {
      // 切换页码 改变当前默认页码
      if (page) {
        this.currentPageNum = page;
      }
      getShopListByPageInfo({
        pageNum: this.currentPageNum,
        pageSize: this.currentPageSize,
        categorySelect: this.categorySelect,
      }).then((result) => {
        this.shopData = [];
        // console.log(result.data)
        this.changeShopDataFormdata(result.data.row, result.data);

        this.total = parseInt(result.data.total);
      });
    },
    sizeChangeQuery(size) {
      // 切换页的大小 改变当前默认大小
      this.currentPageSize = size;
      getShopListByPageInfo({
        pageNum: this.currentPageNum,
        pageSize: size,
        categorySelect: this.categorySelect,
      }).then((result) => {
        this.shopData = [];
        this.changeShopDataFormdata(result.data.row, result.data);
        this.total = parseInt(result.data.total);
      });
    },

    /**
     * 商品照片格式通用转型
     * @param {res.data.row} row
     * @param {res.data} data
     */
    changeShopDataFormdata(row, data) {
      this.shopData = [];
      row.forEach((item) => {
        let iimage = item.image.split(",");
        let resu = {
          id: item.id,
          name: item.name,
          price: item.price,
          describle: item.describle,
          sales: item.sales,
          inventory: item.inventory,
          status: item.status == 1 ? "启售" : "停售",
          image: iimage[0],
          createTime: item.createTime,
          updateTime: item.updateTime,
          category: item.categoryName,
        };
        this.shopData.push(resu);
      });
      if (!isNaN(data.total)) {
        this.total = parseInt(data.total);
      }
      // console.log(this.shopData)
    },
    reflash(){
      this.selectedItems = []
      this.input = ''
      this.diaFormCategoryName = ''
      this.categorySelect = ''
      this.queryShopPageList()
    },
    // 更新商品页
    queryShopPageList() {
      this.shopData = [];
      getShopListByPageInfo({
        pageSize: 20,
        pageNum: 1,
      }).then((res) => {
        this.total = parseInt(res.data.total);
        this.changeShopDataFormdata(res.data.row, res.data);
      });
    },
  },
  mounted() {
    getCategoryAllList().then((res) => {
      this.options = res.data.row;
    });
    getShopListByPageInfo({
      pageSize: 20,
      pageNum: 1,
    }).then((res) => {
      this.changeShopDataFormdata(res.data.row, res.data);
      this.total = parseInt(res.data.total);
    });
  },
};
</script>

<style scoped>
.img:hover {
  transform: scale(2.5);
}
.line {
  text-align: center;
}
.delBut {
  color: red;
}
.line {
  text-align: center;
}
.span-btn {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: #818693;
  border-right: solid 1px #d8dde3;
}
.blueBug {
  color: #419eff !important;
  position: relative;
}
.delBut {
  color: #f56c6c !important;
  position: relative;
}
.el-button-primary {
  color: #333333;
  background-color: #f0ffe7;
  border-color: #fdffa0;
}
.el-button-search {
  margin-left: 10px;
  color: rgb(115, 186, 243);
}
.el-pagination {
  text-align: center;
}
.pages-class {
  margin-top: 10px;
}
div .upload-demo {
  /* padding-left: 80px; */
}
.el-col .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.statuschange {
  color: #fa5454;
}
</style>
