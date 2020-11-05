// 数据持久化，存储在sessionstorage
export function setSessionStorage(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
export function getSessionStorage(v) {
  return JSON.parse(localStorage.getItem(v));
}
