import { useEffect, useState } from "react";
import { api } from "./api";
import "./App.css";


export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ nome: "", quantidade: "" });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "", quantidade: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");


  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/produtos");
      setProducts(data);

    } catch (err) {
      setError("❌ Erro ao carregar produtos. O servidor pode estar offline.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nome || !form.quantidade) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      await api("/produtos", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setSuccess("Produto adicionado!");
      setForm({ nome: "", quantidade: "" });
      loadProducts();

    } catch (err) {
      setError("❌ Erro ao adicionar produto.");
    }
  }

  async function saveEdit(id) {
    try {
      await api(`/produtos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: editForm.nome,
          quantidade: editForm.quantidade
        })
      });

      setSuccess("Produto atualizado!");
      setEditing(null);
      loadProducts();

    } catch (err) {
      setError("❌ Falha ao salvar edição.");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
      await api(`/produtos/${id}`, { method: "DELETE" });
      setSuccess("Produto removido!");
      loadProducts();
    } catch {
      setError("❌ Não foi possível remover.");
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1> Sistema de Estoque Desânima</h1>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2> Adicionar Produto</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
        />

        <button>Adicionar</button>
      </form>

      <h2>Produtos</h2>
      <input
  className="search-bar"
  type="text"
  placeholder="Pesquisar produto..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
      <ul>
  {products
    .filter((p) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    )
    .map((p) => (
      <li key={p.id} className="product-item">

  {editing === p.id ? (
    /* ======== MODO EDIÇÃO REAL ======== */
    <div className="row">
      <div className="left">
        <input
          type="text"
          value={editForm.nome}
          onChange={(e) =>
            setEditForm({ ...editForm, nome: e.target.value })
          }
        />

        <input
          type="number"
          className="qty-input"
          value={editForm.quantidade}
          onChange={(e) =>
            setEditForm({ ...editForm, quantidade: e.target.value })
          }
        />
      </div>

      <div className="right">
        <button onClick={() => saveEdit(p.id)}>💾 Salvar</button>
        <button className="delete" onClick={() => setEditing(null)}>
          Cancelar
        </button>
      </div>
    </div>

  ) : (
    /* ======== MODO NORMAL ======== */
    <div className="row">
      <div className="left">
        <span className="prod-name">{p.nome}</span>

        <span className="prod-qty">
          <span className="qty-num">{p.quantidade}</span>
          <span className="qty-label">unidades</span>
        </span>
      </div>

      <div className="right">
        <button
          onClick={() => {
            setEditing(p.id);
            setEditForm({
              nome: p.nome,
              quantidade: p.quantidade,
            });
          }}
        >
          ✏ Editar
        </button>

        <button
          className="delete"
          onClick={() => deleteProduct(p.id)}
        >
          Remover
        </button>
      </div>
    </div>
  )}

</li>

    ))}
</ul>

    </div>
  );
}
