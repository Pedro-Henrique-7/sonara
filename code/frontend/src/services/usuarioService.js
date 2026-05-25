const URL_BASE = `${import.meta.env.VITE_API_URL}`

// ─── Traduz erros do servidor em mensagens legíveis ───────────────────────────
function extrairMensagemErro(data, fallback) {
  return data?.message || data?.error || fallback;
}

// ─── Cadastrar usuário ─────────────────────────────────────────────────────────
export async function cadastrarUsuario(usuario, foto = null) {
  try {
    const formData = new FormData();
    formData.append("dados", JSON.stringify(usuario));
    if (foto) formData.append("foto", foto);

    const response = await fetch(`${URL_BASE}/usuario`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // Repassa a resposta do servidor (sucesso ou erro estruturado)
    return data;
  } catch (networkErr) {
    // Falha de rede — servidor inacessível
    return {
      status: false,
      status_code: 0,
      message: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    };
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export async function loginUsuario(email, senha) {
  try {
    const response = await fetch(`${URL_BASE}/usuario/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Lança com a mensagem que vier do backend
      const mensagem = extrairMensagemErro(
        data,
        response.status === 401
          ? "E-mail ou senha incorretos."
          : "Erro ao fazer login. Tente novamente."
      );
      const err = new Error(mensagem);
      err.status_code = response.status;
      throw err;
    }

    return data;
  } catch (err) {
    // Se já é um Error estruturado (lançado acima), repassa
    if (err.status_code) throw err;

    // Erro de rede
    const networkErr = new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
    );
    networkErr.status_code = 0;
    throw networkErr;
  }
}

// ─── Atualizar usuário ─────────────────────────────────────────────────────────
export async function atualizarUsuario(id, usuario) {
  try {
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("dados", JSON.stringify(usuario));

    const response = await fetch(`${URL_BASE}/usuario/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      status: false,
      status_code: 0,
      message: "Não foi possível conectar ao servidor ao atualizar os dados.",
    };
  }
}

// ─── Atualizar foto ────────────────────────────────────────────────────────────
export async function atualizarFotoUsuario(id, arquivo) {
  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("foto", arquivo);

    const response = await fetch(`${URL_BASE}/usuario/${id}/foto`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      status: false,
      status_code: 0,
      message: "Erro ao enviar a foto. Tente novamente.",
    };
  }
}

// ─── Deletar usuário ───────────────────────────────────────────────────────────
export async function deletarUsuario(id) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${URL_BASE}/usuario/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      status: false,
      status_code: 0,
      message: "Erro ao deletar a conta. Tente novamente.",
    };
  }
}