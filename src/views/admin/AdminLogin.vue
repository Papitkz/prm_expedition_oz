<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const { signInWithEmail, signInWithGoogle, signUp, loading, isAdmin, userRole, user } = useAdminAuth()

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
    const msg = e.code || e.message || 'Authentication failed'
    const friendlyErrors: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    }
    error.value = friendlyErrors[msg] || msg
  }
}

async function handleGoogleAuth() {
  error.value = ''
  try {
    await signInWithGoogle()
    if (!isAdmin.value) {
      error.value = 'You do not have admin access. Contact the site owner to request admin privileges.'
    }
  } catch (e: any) {
    const msg = e.code || e.message || 'Google sign-in failed'
    if (msg === 'auth/popup-closed-by-user') return
    error.value = msg
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

      <div class="divider-row">
        <span class="divider-line"></span>
        <span class="divider-text">or</span>
        <span class="divider-line"></span>
      </div>

      <button @click="handleGoogleAuth" class="google-btn" :disabled="loading">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

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
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(10, 46, 74, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-compass {
  margin: 0 auto 1rem;
}

.login-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: #c9a84c;
  letter-spacing: 0.05em;
}

.login-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.5);
  margin-top: 0.25rem;
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

.divider-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(201, 168, 76, 0.15);
}

.divider-text {
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8f5ef;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.google-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
