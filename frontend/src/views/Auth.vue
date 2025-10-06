<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../lib/api';
import { Loader } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores';

const router = useRouter();
const store = useUserStore();

const activeTab = ref<'login' | 'register'>('login');
const loginForm = ref({
  username: '',
  password: ''
});
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref({
  login: false,
  register: false
});

const switchTab = (tab: 'login' | 'register') => {
  activeTab.value = tab;
  loginForm.value = { username: '', password: '' };
  registerForm.value = { username: '', password: '', confirmPassword: '' };
};

const handleSubmit = async (type: 'login' | 'register') => {
  isLoading.value[type] = true;
  const response = await api(
    `/auth/${type}`,
    'POST',
    type === 'login' ? loginForm.value : registerForm.value
  );
  //TODO: Improve error management (UX-wise)
  // Successfull login/register sends only user id and username.
  // If we get something, else something went wrong.
  if (!response.id || !response.username) {
    // .message in case of an automatic error thrown by the backend type checker
    // .error if of an error thrown manually in case of a wrong password/username, etc.
    alert(response.message || response.error);
    isLoading.value[type] = false;
    return;
  }
  isLoading.value[type] = false;
  store.setUser(response);
  router.push('/dashboard');
};

const handleLogin = async () => handleSubmit('login');
const handleRegister = async () => handleSubmit('register');

// If a logged in user navigates to /auth, they get signed out.
onMounted(() => {
  if (store.currentUser) {
    api('/auth/logout');
    store.clearUser();
  }
});
</script>

<template>
  <div class="auth-container">
    <div class="modal-content">
      <div class="tab-headers">
        <button
          :class="['tab-button', { active: activeTab === 'login' }]"
          @click="switchTab('login')"
        >
          Login
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'register' }]"
          @click="switchTab('register')"
        >
          Register
        </button>
        <div
          class="tab-indicator"
          :style="{
            transform: `translateX(${activeTab === 'login' ? '0%' : '100%'})`
          }"
        ></div>
      </div>

      <div class="forms-container">
        <div
          class="forms-wrapper"
          :style="{
            transform: `translateX(${activeTab === 'login' ? '0%' : '-50%'})`
          }"
        >
          <!-- Login Form -->
          <div class="form-container">
            <h2>Welcome Back</h2>
            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label for="login-username">Username</label>
                <input
                  id="login-username"
                  v-model="loginForm.username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" class="submit-button">
                <span v-if="!isLoading.register"> Register </span>
                <span v-else class="spin"><Loader /></span>
              </button>
            </form>
          </div>

          <!-- Register Form -->
          <div class="form-container">
            <h2>Create Account</h2>
            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="form-group">
                <label for="register-username">Username</label>
                <input
                  id="register-username"
                  v-model="registerForm.username"
                  type="text"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div class="form-group">
                <label for="register-password">Password</label>
                <input
                  id="register-password"
                  v-model="registerForm.password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div class="form-group">
                <label for="register-confirm-password">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button type="submit" class="submit-button">
                <span v-if="!isLoading.register"> Register </span>
                <span v-else class="spin"><Loader /></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.modal-content {
  pointer-events: all;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 400px;
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  height: 480px; /* Fixed height to prevent container resizing */
}

.tab-headers {
  display: flex;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f1f5f9;

  color: #475569;
}

.tab-button.active {
  color: #3b82f6;
  background-color: white;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background-color: #3b82f6;
  transition: transform 0.3s ease;
  z-index: 1;
}

.forms-container {
  height: 424px; /* Container height minus tab headers */
  overflow: hidden;
  position: relative;
}

.forms-wrapper {
  display: flex;
  width: 200%; /* Double width to fit both forms side by side */
  height: 100%;
  transition: transform 0.4s ease-in-out;
}

.form-container {
  width: 50%; /* Each form takes half of the wrapper width */
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;
}

.submit-button:hover {
  background-color: #2563eb;
}

.submit-button:active {
  background-color: #1d4ed8;
}

.spin {
  display: inline-flex;

  animation: spinning 1.5s linear infinite;
}

@keyframes spinning {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal-content {
    min-width: unset;
    width: 95%;
    margin: 20px;
    height: 450px;
  }

  .forms-container {
    height: 394px;
  }

  .form-container {
    padding: 24px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 14px;
  }

  .form-container h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .auth-form {
    gap: 16px;
  }
}
</style>
