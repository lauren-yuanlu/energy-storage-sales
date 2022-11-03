<template>
  <div class="energyStorageSales">
    <!-- 海报 -->
    <div>
      <img
        class="poster"
        :src="poster"
        alt=""
        @load="imgLoad"
      />
    </div>
    <!-- 页面内容 -->
    <div class="mainContent" v-if="isImgLoad">
      <!-- 有效期 -->
      <div class="validDate">
        <div class="startDate">
          <span>开始日期：{{ startDate }}</span>
          <div class="time">
            <span class="block">{{ startHour }}</span>
            <span class="colon">:</span>
            <span class="block">{{ startMinute }}</span>
            <span class="colon">:</span>
            <span class="block">{{ startSecond }}</span>
          </div>
        </div>
        <div class="endDate">
          <span>结束日期：{{ endDate }}</span>
          <div class="time">
            <span class="block">{{ endHour }}</span>
            <span class="colon">:</span>
            <span class="block">{{ endMinute }}</span>
            <span class="colon">:</span>
            <span class="block">{{ endSecond }}</span>
          </div>
        </div>
      </div>
      <!-- 支付金额 -->
      <div class="paymentAmount">
        <span>支付金额</span>
        <br>
        <span class="amount">￥{{amount}}</span>
      </div>
      <!-- 填写内容 -->
      <div class="fillContent">
        <van-field v-model="customerName" label="客户姓名：" placeholder="请输入客户姓名" required />
        <van-field v-model="customerTel" label="客户手机：" placeholder="请输入客户手机" required />
        <van-field v-model="location" label="所在地区：" placeholder="请选择所在地区" readonly required @focus="showArea"/>
        <van-field v-model="detailedAddress" label="详细地址：" placeholder="请输入详细地址" required />
        <van-field v-model="referrer" label="推荐人：" placeholder="请输入推荐人" required />
      </div>
      <!-- 发票类型 -->
      <div class="invoice">
        <div class="invoiceType">
          <span class="invoiceText">发票类型</span>
          <div
            :class="isChecked == index ? 'isCheckedInvoiceType' : 'invoiceTypes'"
            v-for="(item, index) in invoiceTypes"
            :key="index"
            @click="selectInvoiceType(item.type, index)"
          >
            <span class="type">{{ item.type }}</span>
          </div>
        </div>
        <div class="invoiceType">
          <span class="invoiceText">发票抬头</span>
          <div
            :class="isCheckedInvoiceHeader == index ? 'isCheckedInvoiceHeader' : 'invoiceTypes'"
            v-for="(item, index) in invoiceHeaders"
            :key="index"
            @click="selectInvoiceHeader(item.header, index)"
          >
            <span class="type">{{ item.header }}</span>
          </div>
        </div>
        <div v-if="selectedInvoiceType == '普通发票' && selectedInvoiceHeader == '个人' || (isChecked == 0 && isCheckedInvoiceHeader == 0)">
          <van-field v-model="personalName" label="个人名称" placeholder="请输入个人名称" required />
        </div>
        <div v-else-if="selectedInvoiceType == '增值税专用发票'">
          <van-field v-model="companyName" label="单位名称" placeholder="请输入单位名称" required />
          <van-field v-model="identificationNum" label="纳税人识别号" placeholder="请输入纳税人识别号" required />
          <van-field v-model="registeredAddress" label="注册地址" placeholder="请输入注册地址" required />
          <van-field v-model="registeredTel" label="注册电话" placeholder="请输入注册电话" required />
          <van-field v-model="bank" label="开户银行" placeholder="请输入开户银行" required />
          <van-field v-model="bankAccount" label="银行账号" placeholder="请输入银行账号" required />
        </div>
        <div v-else>
          <van-field v-model="companyName" label="单位名称" placeholder="请输入单位名称" required />
          <van-field v-model="identificationNum" label="纳税人识别号" placeholder="请输入纳税人识别号" required />
          <van-field v-model="registeredAddress" label="注册地址" placeholder="请输入注册地址" />
          <van-field v-model="registeredTel" label="注册电话" placeholder="请输入注册电话" />
          <van-field v-model="bank" label="开户银行" placeholder="请输入开户银行" />
          <van-field v-model="bankAccount" label="银行账号" placeholder="请输入银行账号" />
        </div>
      </div>
      <!-- 支付按钮 -->
      <div class="btn">
        <van-button class="btnPay bold" block 
          :disabled="
          selectedInvoiceType == '增值税专用发票' ? customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || referrer == '' || sign || isDisabled ||
          companyName == '' || identificationNum == '' || registeredAddress == '' || registeredTel == '' || bank == '' || bankAccount == '' : 
          (selectedInvoiceHeader == '个人' || isCheckedInvoiceHeader == 0 ? customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || referrer == '' || sign || isDisabled || personalName == '' :
           customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || referrer == '' || sign || isDisabled || companyName == '' || identificationNum == '')"
          @click="pay"
        >
          立即支付
        </van-button>
      </div>
      <!-- 省市区弹窗 -->
      <van-popup
        class="pop"
        v-model="isShowArea"
        round
        position="bottom"
        :style="{ height: '51%' }"
        :overlay-style="{ opacity: '0.4' }"
      >
        <van-area :area-list="areaList" @cancel="cancel" @confirm="confirm"/>
      </van-popup>

      <!-- 提示框 -->
      <van-dialog v-model="showTip" title="提示" show-cancel-button @confirm="confirmPayment">
        确定付款吗
      </van-dialog>
    </div>

    <form id="submitForm" action="" method="post" enctype="multipart/form-data" style="display:none"></form>
  </div>
</template>

<script>
import { Field, Button, Popup, Area, Dialog } from 'vant';
import { getProductById, placeOrder } from "@/api/energyStorageSales";
import { areaList } from '@vant/area-data';

export default {
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      poster: "",
      isImgLoad: false,
      startDate: "",
      endDate: "",
      startHour: "",
      startMinute: "",
      startSecond: "",
      endHour: "",
      endMinute: "",
      endSecond: "",
      amount: "",
      customerName: "",
      customerTel: "",
      province: "",
      city: "",
      area: "",
      location: "",
      detailedAddress: "",
      referrer: "",
      paymentAmount: "",
      openid: "",
      invoiceTypes: [
        {
          type: "普通发票",
          invoiceHeader: [
            {
              header: "个人"
            }, 
            {
              header: "单位"
            }
          ]
        },
        {
          type: "增值税专用发票",
          invoiceHeader: [
            {
              header: "单位"
            }
          ]
        } 
      ],
      invoiceHeaders: [
        {
          header: "个人"
        }, 
        {
          header: "单位"
        }
      ],
      isChecked: 0,
      isCheckedInvoiceHeader: 0,
      personalName: "",
      companyName: "",
      identificationNum: "",
      registeredAddress: "",
      registeredTel: "",
      bank: "",
      bankAccount: "",
      selectedInvoiceType: "普通发票",
      selectedInvoiceHeader: "个人",
      isShowArea: false,
      areaList,
      sign: true,
      isDisabled: false,
      showTip: false
    }
  },
  created() {
    document.title = "利星行能源产品页"
    this.toGetProductById()
  },
  methods: {
    imgLoad() {
      this.isImgLoad = true
    },
    async toGetProductById() {
      let params =  {
        // id: 3
        id: this.$route.query.id
      }
      let res = await getProductById(params)
      this.poster = "https://apiqa.lshmec.cn/4WX/commons/oss/getFile?bucketName=blueparts&fileKey=" + res.data.data.productPics
      this.startDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(res.data.data.startTime)[0]
      this.endDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(res.data.data.endTime)[0]
      this.startHour = this.getZero(this.dayjs(this.startDate).hour())
      this.startMinute = this.getZero(this.dayjs(this.startDate).minute())
      this.startSecond = this.getZero(this.dayjs(this.startDate).second())
      this.endHour = this.getZero(this.dayjs(this.startDate).hour())
      this.endMinute = this.getZero(this.dayjs(this.startDate).minute())
      this.endSecond = this.getZero(this.dayjs(this.startDate).second())
      this.amount = res.data.data.eventPrice
      this.isDuringDate()
    },
    getZero(num) {
      if(parseInt(num) < 10 ) {
        num = '0' + num
      }
      return num
    },
    async pay() {
      this.showTip = true
    },
    selectInvoiceType(val, index) {
      this.isChecked = index
      this.selectedInvoiceType = val
      this.isCheckedInvoiceHeader = 0
      if(this.selectedInvoiceType == '普通发票') {
        this.selectedInvoiceHeader = '个人'
      } else {
        this.selectedInvoiceHeader = '单位'
      }
      this.invoiceTypes.forEach(item => {
        if(val == item.type) {
          this.invoiceHeaders = item.invoiceHeader
        }
      })
      if(this.selectedInvoiceType == "普通发票" && this.isCheckedInvoiceHeader == 0) {
        this.personalName = ""
      } else {
        this.companyName = ""
        this.identificationNum = ""
        this.registeredAddress = ""
        this.registeredTel = ""
        this.bank = ""
        this.bankAccount = ""
      }
    },
    selectInvoiceHeader(val, index) {
      this.selectedInvoiceHeader = val
      this.isCheckedInvoiceHeader = index
      if(this.selectedInvoiceHeader == "单位") {
        this.companyName = ""
        this.identificationNum = ""
        this.registeredAddress = ""
        this.registeredTel = ""
        this.bank = ""
        this.bankAccount = ""
      } else {
        this.personalName = ""
      }
    },
    showArea() {
      this.isShowArea = true
    },
    cancel() {
      this.isShowArea = false
    },
    confirm(val) {
      this.isShowArea = false
      this.location = val[0].name + '-' + val[1].name + '-' + val[2].name
      this.province = val[0].name
      this.city = val[1].name
      this.area = val[2].name
    },
    isDuringDate() {
      var date = new Date()
      let curDate = this.dayjs(date.toLocaleDateString()).format("YYYY-MM-DD")
      if (curDate >= this.startDate && curDate <= this.endDate) {
        this.sign = false
      } else {
        this.sign = true
      }
    },
    async confirmPayment() {
      let data = {
        city: this.city,
        contactAddress: this.detailedAddress,
        referrer: this.referrer,
        cuName: this.customerName,
        cuPhone: this.customerTel,
        district: this.area,
        invoiceAccount: this.bankAccount,
        invoiceAddress: this.registeredAddress,
        invoiceBank: this.bank,
        invoiceCuName: this.selectedInvoiceHeader == '个人' ? this.personalName : this.companyName,
        invoiceHeader: this.selectedInvoiceHeader,
        invoiceIdentificationNumber: this.identificationNum,
        invoicePhone: this.registeredTel,
        invoiceType: this.isChecked + 1,
        openid: window.sessionStorage.getItem('openid'),
        // pid: 3,
        pid: this.$route.query.id,
        province: this.province,
        remark: "",
        totalAmount: this.amount
      }

      let res = await placeOrder(data)
      let url = res.data.data.msg
      var json_str = JSON.stringify(res.data.data.data); 
      var json_str2 = JSON.parse(json_str);
      var json_str3 = JSON.parse(json_str2);

      for(let key in json_str3){
        var newInput = document.createElement("input")
        if(key == "subOrders") {
          newInput.name = key
          newInput.type = "text"
          newInput.value = JSON.stringify(json_str3.subOrders)
          document.forms[0].appendChild(newInput)
        } else {
          newInput.name = key
          newInput.type = "text"
          newInput.value = json_str3[key]
          document.forms[0].appendChild(newInput)
        }
      }
      document.forms[0].action = url
      document.forms[0].submit()
    },
  }
}
</script> 

<style lang="less" scoped>
.energyStorageSales {
  // background: #000;
  // overflow: auto;
  padding: 0 10px;
  .poster {
    width: 100%;
  }
  .mainContent {
    margin-top: 10px;
    .validDate {
      width: 100%;
      display: table;
      border-radius: 10px;
      overflow: hidden;
      .startDate {
        height: auto;
        display: table-cell;
        padding: 10px 2px;
        text-align: center;
        background: #fcf3ca;
      }
      .endDate {
        height: auto;
        display: table-cell;
        padding: 10px 2px;
        text-align: center;
        background: #fff7d3;
      }
      .time {
        margin-top: 6px;
        text-align: center;
        .colon {
          display: inline-block;
          margin: 0 4px;
          color: #000;
        }
        .block {
          display: inline-block;
          width: 22px;
          height: 22px;
          line-height: 22px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          background-color: #000;
        }
      }
    }
    .paymentAmount {
      margin-top: 10px;
      padding: 10px 20px;
      background: #fefefe;;
      border: 1px solid #f6f4f7;
      border-radius: 12px;
      .amount {
        border: 1px solid #f8c802;
        width: fit-content;
        display: block;
        margin-top: 10px;
        padding: 10px 20px;
        background: #fffdf1;
        color: #f8c802;
      }
    }
    .fillContent {
      margin-top: 10px;
      padding: 10px 15px;
      border-radius: 10px;
      background: #fefefe;
    }
    .invoice {
      margin-top: 10px;
      padding: 10px 15px 10px 15px;
      border-radius: 10px;
      background: #fefefe;
      .invoiceType {
        margin-bottom: 8px;
        .invoiceText {
          display: block;
          font-weight: bold;
        }
        .invoiceTypes {
          display: inline-block;
          margin-top: 8px;
          margin-right: 10px;
          padding: 6px 10px;
          border-radius: 15px;
          background: #f2f2f2;
        }
        .isCheckedInvoiceType, .isCheckedInvoiceHeader {
          display: inline-block;
          margin-top: 8px;
          margin-right: 10px;
          padding: 6px 10px;
          border: 1px solid red;
          border-radius: 15px;
          color: red;
          background: #fae8e5;
        }
      }
    }
    .btn {
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .btnPay {
        width: auto;
        height: auto;
        padding: 10px 100px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #000;
        background: #f9faf5;
        border: 1px solid #f9faf5;
        border-radius: 10px;
        font-weight: bold;
      }
    }
    /deep/ .van-dialog__header {
      padding-top: 20px;
      line-height: 24px;
    }
    /deep/ .van-dialog__content {
      line-height: 48px;
      text-align: center;
      color: #aeacaf;
    }
  }
}
</style>
