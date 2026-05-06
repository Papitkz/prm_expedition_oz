<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const { signInWithEmail, signUp, loading, isAdmin, userRole, user } = useAdminAuth()

const email = ref('')
const password = ref('')
const displayName = ref('')
const isRegistering = ref(false)
const error = ref('')
const successMsg = ref('')

watch(isAdmin, (val) => {
  if (val) router.push('/admin/dashboard')
})

async function handleEmailAuth() {
  error.value = ''
  successMsg.value = ''
  try {
    if (isRegistering.value) {
      await signUp(email.value, password.value, displayName.value)
      if (isAdmin.value) {
        successMsg.value = 'Admin account created! Redirecting...'
      } else {
        successMsg.value = 'Account created! You are logged in as a user. Admin access requires approval from the owner.'
      }
      isRegistering.value = false
    } else {
      await signInWithEmail(email.value, password.value)
      if (isAdmin.value) {
        // Will redirect via watch
      } else {
        error.value = 'You do not have admin access. Contact the site owner to request admin privileges.'
      }
    }
  } catch (e: any) {
    const msg = e.message || e.error_description || 'Authentication failed'
    const friendlyErrors: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password.',
      'User already registered': 'An account with this email already exists.',
      'Email not confirmed': 'Please confirm your email before signing in.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
    }
    error.value = friendlyErrors[msg] || msg
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-compass">
          <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <polygon points="40,16 37,36 40,40 43,36" fill="#c9a84c"/>
            <polygon points="40,64 37,44 40,40 43,44" fill="rgba(201,168,76,0.4)"/>
            <circle cx="40" cy="40" r="3" fill="#c9a84c"/>
          </svg>
        </div>
        <h1 class="login-title">Expedition OZ</h1>
        <p class="login-subtitle">Admin Dashboard</p>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

      <form @submit.prevent="handleEmailAuth" class="login-form">
        <div v-if="isRegistering" class="form-group">
          <label class="form-label">Display Name</label>
          <input v-model="displayName" type="text" class="form-input" placeholder="Your name" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-input" placeholder="admin@expeditionoz.com" required />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-input" placeholder="Enter password" required minlength="6" />
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading" style="padding: 14px; font-size: 0.75rem; width: 100%; text-align: center;">
          {{ loading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In') }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isRegistering ? 'Already have an account?' : "Don't have an account?" }}
        <button @click="isRegistering = !isRegistering; error = ''; successMsg = ''" class="toggle-btn">
          {{ isRegistering ? 'Sign In' : 'Register' }}
        </button>
      </p>

      <p class="info-text">
        Only authorized users can access the admin panel. New accounts require admin approval.
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #071a2b;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(10, 46, 74, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 2.5rem;
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 0.5rem;
}

.login-compass {
  margin: 0 auto 1rem;
  display: block;
}

.login-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: #c9a84c;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.login-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.5);
  margin-top: 0.5rem;
}

.alert {
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid;
  line-height: 1.5;
}

.alert-error {
  background: rgba(224, 123, 90, 0.1);
  border-color: rgba(224, 123, 90, 0.3);
  color: #e07b5a;
}

.alert-success {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  color: #4caf50;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.6);
}

.form-input {
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.2);
  color: #f8f5ef;
  padding: 0.75rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.3s;
  -webkit-appearance: none;
}

.form-input:focus {
  border-color: #c9a84c;
}

.toggle-text {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: rgba(248, 245, 239, 0.5);
}

.toggle-btn {
  background: none;
  border: none;
  color: #c9a84c;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.info-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.3);
  line-height: 1.5;
}
</style>
