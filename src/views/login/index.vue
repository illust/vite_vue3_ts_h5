<template>
  <div class="login-right-warp">
    <div class="login-right-warp-title">login</div>
    <div class="login-right-warp-form">
      <div class="login-right-warp-form_title">用户名登录</div>

      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item prop="AccountNo">
          <el-input
            v-model="ruleForm.AccountNo"
            autocomplete="off"
            :prefix-icon="User"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item prop="AccountPwd">
          <el-input
            v-model="ruleForm.AccountPwd"
            type="password"
            autocomplete="off"
            :prefix-icon="Lock"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="Code">
          <el-input
            v-model.number="ruleForm.Code"
            :prefix-icon="Promotion"
            class="login-content-code"
            placeholder="请输入验证码"
          />
          <span class="login-content-code-img" @click="generateCodeAsync()">{{
            verificationCode.Code
          }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-msg">
        * 温馨提示：建议使用谷歌、Microsoft Edge，版本 79.0.1072.62
        及以上浏览器，360浏览器请使用极速模式
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { postGenerateCodeAsync } from '@/api/login'
// import { Lock, Promotion, User } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// 使用 Vue Router 的 useRouter 函数来获取 router 实例
const router = useRouter()

const ruleFormRef = ref<FormInstance>()

// 页面加载时
onMounted(() => {
  // generateCodeAsync()
})

const validateCodeKey = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else {
    callback()
  }
}

const validateAccountNo = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}
const validateAccountPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  AccountNo: '123',
  AccountPwd: '',
  CodeKey: '',
  Code: '',
})

const verificationCode = reactive({
  CodeKey: '',
  Code: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  AccountNo: [{ validator: validateAccountNo, trigger: 'blur' }],
  AccountPwd: [{ validator: validateAccountPwd, trigger: 'blur' }],
  Code: [{ validator: validateCodeKey, trigger: 'blur' }],
})
// const generateCodeAsync = () => {
//   postGenerateCodeAsync().then((res: any) => {
//     verificationCode.Code = res.Data.Code
//     verificationCode.CodeKey = res.Data.Key
//     ruleForm.CodeKey = res.Data.Key
//   })
// }

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      router.push('/home')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: #fff;

  .login-left {
    .login-left-logo {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;

      img {
        width: 100px;
        height: 64px;
      }

      .login-left-logo-text {
        display: flex;
        flex-direction: column;
      }

      .login-left-logo-text span {
        margin-left: 10px;
        font-size: 30px;
        font-weight: 700;
        color: #de2910;
      }

      .login-left-logo-text .login-left-logo-text-msg {
        font-size: 12px;
        color: #de2910;
      }
    }

    .login-left-img {
      width: 90%;
      margin: 70px 0 0px 10%;
      height: 90%;
      min-height: 500px;
      min-width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 500px;
        min-width: 500px;
      }
    }
  }

  .login-right {
    width: 650px;

    .login-right-warp {
      border: 1px solid #e76959;
      border-radius: 3px;
      width: 500px;
      height: 550px;
      position: relative;
      overflow: hidden;
      background-color: #fff;
      margin: auto;

      .login-right-warp-title {
        height: 130px;
        line-height: 130px;
        font-size: 32px;
        font-weight: 800;
        text-align: center;
        animation: logoAnimation 0.3s ease;
        animation-delay: 0.3s;
        color: #f00;
      }

      .login-right-warp-form {
        padding: 0 50px 50px;
      }

      .login-right-warp-form_title {
        color: #de2910;
        width: 100%;
        padding: 10px 0px;
        border-bottom: 1px solid #e4e7ed;
        position: relative;
      }

      .login-right-warp-form_title::after {
        content: '';
        position: absolute;
        width: 90px;
        height: 2px;
        background: #de2910;
        bottom: 0;
        left: 0px;
      }
    }

    .el-form {
      margin-top: 30px;
    }

    .el-input {
      width: 100%;
      height: 40px;
    }

    .el-button {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      background: #de2910;
      border: #de2910;
      margin: 20px 0px;
    }

    .login-content-code {
      width: 70%;
    }

    .login-content-code-img {
      width: 25%;
      background-color: #fff;
      border: 1px solid rgb(220, 223, 230);
      height: 38px;
      border-radius: 5px;
      margin-left: 4.5%;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
    }

    .login-msg {
      margin-top: 30px;
      color: #a8abb2;
      font-size: 12px;
    }
  }
}

::v-deep .el-form-item__content {
  justify-content: center;
}
</style>
