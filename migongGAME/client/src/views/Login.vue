<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="输入登录账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-button type="success" size="large" :loading="loading" @click="handleLogin" style="width:100%">
          登录
        </el-button>
      </el-form>
      <div class="auth-links">
        <el-button text @click="$router.push('/register')">没有账号？立即注册</el-button>
        <el-button text @click="$router.push('/')">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)

const form = reactive({ account: '', password: '' })
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 3, max: 30, message: '账号3-30个字符', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  loading.value = true
  try {
    await auth.login(form.account, form.password)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, #87ceeb 0%, #f5f0e8 60%);
}
.auth-card {
  background: white; border-radius: 16px; padding: 40px;
  width: 400px; max-width: 90vw; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.auth-card h2 { text-align: center; color: #3e2723; margin-bottom: 24px; font-size: 24px; }
.auth-links { margin-top: 16px; display: flex; justify-content: space-between; }
</style>
