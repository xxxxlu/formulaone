<template>
  <div class="notfound">
    <div class="card">
      <p class="code">404</p>
      <h1 class="title">Oops, too early!</h1>
      <p class="subtitle">The gift draw unlocks after the Christmas card finishes. Please head back and try again.</p>
      <router-link class="btn" to="/home">Back to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.9));
  padding: 24px;
}
.card {
  max-width: 540px;
  width: 100%;
  background: rgba(12, 18, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: #e9f0ff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}
.code {
  font-size: 52px;
  font-weight: 800;
  letter-spacing: 2px;
  margin: 0;
  color: #ff6b6b;
}
.title {
  margin: 12px 0 6px;
  font-size: 26px;
  font-weight: 700;
}
.subtitle {
  margin: 0 0 18px;
  color: #9fb0c8;
  line-height: 1.5;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  color: #0c121c;
  background: linear-gradient(135deg, #ff9f6b, #ff6b6b);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(255, 107, 107, 0.45);
}
</style>
