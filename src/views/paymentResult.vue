<template>
  <div class="orderResult">
    <van-loading size="48px" vertical v-show="showLoading">正在查询中，请稍等...</van-loading>

    <div v-if="!showLoading">
      <div class="header" v-if="orderStatus == 1">
        <img
          src="@/assets/img/success.png"
          alt=""
          class="success"
        />
        <span class="successText">支付成功</span>
        <div class="describe">
          尊敬的用户：
          <br>
          您有一笔订单<span style="color: blue">{{ $route.query.orderNumber }}</span><span style="color: red">已成功付款</span>。请耐心等待，我们会尽快给您安排发货。
        </div>
      </div>
      <div class="header" v-else-if="orderStatus == 0">
        <img
          src="@/assets/img/waiting.png"
          alt=""
          class="waiting"
        />
        <span class="waitingText">待支付</span>
        <div class="describe">
          尊敬的用户：
          <br>
          您有一笔订单<span style="color: blue">{{ $route.query.orderNumber }}</span><span style="color: red">未成功付款</span>。请尽快付款，别让好货从你的世界错过。付款成功后会尽快给您安排发货。
        </div>
      </div>
      <div class="header" v-else>
        <img
          src="@/assets/img/overtime.png"
          alt=""
          class="overtime"
        />
        <span class="overtimeText">已取消</span>
        <div class="describe">
          尊敬的用户：
          <br>
          您有一笔订单<span style="color: blue">{{ $route.query.orderNumber }}</span><span style="color: red">已超时</span>。如需购买，请返回产品页下单。
        </div>
      </div>
      <!-- <div class="logo">
        <img
          src="@/assets/img/logo.jpg"
          alt=""
        />
      </div> -->
      <div class="btn" v-if="orderStatus == 0">
        <van-button class="nextBtn" block @click="continuePayment">继续付款</van-button>
      </div>
    </div>

    <form id="submitForm" action="" method="post" enctype="multipart/form-data" style="display:none"></form>
  </div>
</template>

<script>
import { Button, Loading } from 'vant';
import { getOrderStatus, getOrderDetail } from "@/api/energyStorageSales";

export default {
  components: {
    [Button.name]: Button,
    [Loading.name]: Loading
  },
  data() {
    return {
      orderStatus: "",
      orderNumber: "",
      interval: "",
      showLoading: true,
      num: 0
    }
  },
  created() {
    document.title = "支付结果"
    this.toGetOrderStatus()
  },
  beforeDestroy() {
    //清除轮询   
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    toGetOrderStatus() {
      this.num++
      let params = {
        orderNumber: this.$route.query.orderNumber
        // orderNumber: "20221101150117127935703"
      }
      getOrderStatus(params).then(res => {
        if(res.data.data.payStatus == 1 || res.data.data.payStatus == 2) {
          clearInterval(this.interval)
          this.showLoading = false
          this.orderStatus = res.data.data.payStatus
        } else {
          if(this.num == 1) {
            this.loopOrderState()
          } else {
            this.showLoading = false
            this.orderStatus = res.data.data.payStatus
          }
        }
      })
    },
    async continuePayment() {
      let params = {
        orderNumber: this.$route.query.orderNumber
        // orderNumber: "20221101150117127935703"
      }
      let res = await getOrderDetail(params)
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
    loopOrderState() {
      this.interval = setInterval(() => {
        this.toGetOrderStatus()
      }, 3000)
    },
  }
}
</script> 

<style lang="less" scoped>
.orderResult {
  .header {
    padding: 15px 0;
    text-align: center;
    background: #fff;
    .success, .waiting, .overtime {
      width: 36px;
      height: 36px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .successText, .waitingText, .overtimeText {
      line-height: 36px;
      vertical-align: middle;
      font-size: 28px;
      font-weight: bold;
    }
    .describe {
      line-height: 28px;
      margin: 10px 12px 0px 12px;
      padding: 12px;
      border-radius: 12px;
      text-align: left;
      background: #fff5ed;
    }
  }
  .logo {
    margin-top: 10px;
    padding: 15px 0;
    text-align: center;
    background: #fff;
  }
  .btn {
    margin-top: 10px;
    padding: 15px 0;
    text-align: center;
    background: #fff;
    .nextBtn {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
