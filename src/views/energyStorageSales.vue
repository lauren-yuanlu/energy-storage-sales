<template>
  <div class="energyStorageSales">
    <!-- 海报 -->
    <div>
      <img
        class="poster"
        src="@/assets/img/poster.jpg"
        alt=""
      />
    </div>
    <!-- 页面内容 -->
    <div class="mainContent">
      <!-- 有效期 -->
      <div class="validDate">
        <div class="startDate">
          <span>开始日期：{{ startDate }}</span>
          <div class="time">
            <span class="block">00</span>
            <span class="colon">:</span>
            <span class="block">00</span>
            <span class="colon">:</span>
            <span class="block">00</span>
          </div>
        </div>
        <div class="endDate">
          <span>结束日期：{{ endDate }}</span>
          <div class="time">
            <span class="block">23</span>
            <span class="colon">:</span>
            <span class="block">59</span>
            <span class="colon">:</span>
            <span class="block">00</span>
          </div>
        </div>
      </div>
      <!-- 支付金额 -->
      <div class="paymentAmount">
        <span>支付金额</span>
        <br>
        <span class="amount">￥1998</span>
      </div>
      <!-- 填写内容 -->
      <div class="fillContent">
        <van-field v-model="customerName" label="客户姓名：" placeholder="请输入客户姓名" required />
        <van-field v-model="customerTel" label="客户手机：" placeholder="请输入客户手机" required />
        <van-field v-model="location" label="所在地区：" placeholder="请选择所在地区" readonly required @focus="showArea"/>
        <van-field v-model="detailedAddress" label="详细地址：" placeholder="请输入详细地址" required />
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
          selectedInvoiceType == '增值税专用发票' ? customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || 
          companyName == '' || identificationNum == '' || registeredAddress == '' || registeredTel == '' || bank == '' || bankAccount == '' : 
          (selectedInvoiceHeader == '个人' || isCheckedInvoiceHeader == 0 ? customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || personalName == '' :
           customerName == '' || customerTel == '' || location == '' || detailedAddress == '' || companyName == '' || identificationNum == '')"
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
    </div>
  </div>
</template>

<script>
import { Field, Button, Popup, Area } from 'vant';
// import {
//   getConfig
// } from "@/api/energyStorageSales";
// import wx from 'weixin-js-sdk';

export default {
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Area.name]: Area 
  },
  data() {
    return {
      startDate: "10月20日",
      endDate: "10月31日",
      customerName: "",
      customerTel: "",
      location: "",
      detailedAddress: "",
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
      areaList: {
        province_list: {
          province1: '北京市',
          province2: '天津市',
        },
        city_list: {
          province1_city1: '北京市',
          province2_city2: '天津市',
        },
        county_list: {
          province1_city1_country1: '东城区',
          province1_city1_country2: '西城区',
          // ....
        }
      }
    }
  },
  created() {
    // let code= this.getUrlKey("code");
    // if(code){
    //   this.$axios.get('https://api.weixin.qq.com'+'/sns/oauth2/access_token?appid='+appid+'&secret='+appsecret+'&code='+code+'&grant_type=authorization_code')
    //   .then(res=>{
    //     this.openid = res.data.openid;
    //   }).catch(error=>{
    //   })
    // }else{
    //   this.getCodeApi();
    // }
    // this.initWxConfig()
  },
  methods: {
    // getCodeApi(){//获取code   
    //   let urlNow=encodeURIComponent(window.location.href);
    //   let url= 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlNow+'&response_type=code&scope=snsapi_userinfo#wechat_redirect';
    //   window.location.href = url
    // },
    // getUrlKey(name){//获取url 参数
    //   return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    // },
    // initWxConfig() {
    //   let params = {
    //     url: window.location.href.split('#')[0],
    //     appCode: "replacePartSupplier"
    //   }
    //   getConfig(params).then((res) => {
    //     var data=res.data.data;
    //     //获取签名
    //     wx.config({
    //       beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    //       debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //       appId: data.appid, // 必填，企业微信的corpID
    //       timestamp: data.timestamp, // 必填，生成签名的时间戳
    //       nonceStr: data.nonceStr, // 必填，生成签名的随机串
    //       signature: data.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
    //       jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    //     });
    //   })

    //   wx.ready(function () {
    //     console.log("ready");
    //   });

    //   wx.error(function (res) {
    //     console.log("res",res);
    //   });
    // },
    pay() {
      console.log("aaa");
      // wx.chooseWXPay({
      //   timestamp: 0, // 支付签名时间戳，注意微信 jssdk 中的所有使用 timestamp 字段均为小写。但最新版的支付后台生成签名使用的 timeStamp 字段名需大写其中的 S 字符
      //   nonceStr: '', // 支付签名随机串，不长于 32 位
      //   package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      //   signType: '', // 微信支付V3的传入 RSA ,微信支付V2的传入格式与V2统一下单的签名格式保持一致
      //   paySign: '', // 支付签名
      //   success: function (res) {
      //     // 支付成功后的回调函数
      //   }
      // });
    },
    selectInvoiceType(val, index) {
      this.isChecked = index
      this.selectedInvoiceType = val
      this.isCheckedInvoiceHeader = 0
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
    }
  }
}
</script> 

<style lang="less" scoped>
.energyStorageSales {
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
  }
}
</style>
