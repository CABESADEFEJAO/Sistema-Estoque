const API = "http://localhost:3000";

export async function api(endpoint, options = {}) {
  try {
    const res = await fetch(API + endpoint, {
      headers: { "Content-Type": "application/json" },
      ...options
    });

    if (!res.ok) {
      throw new Error("Erro na requisição: " + res.status);
    }

    return res.json();
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
}
