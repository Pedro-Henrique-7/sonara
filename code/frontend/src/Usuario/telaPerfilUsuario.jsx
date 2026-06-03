import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./telaPerfilUsuario.css";

import fotoPerfil from "../img/fotoPerfil.jpg";

import {
  atualizarUsuario,
  atualizarFotoUsuario,
  deletarUsuario,
  buscarUsuarioPorId,
} from "../services/usuarioService";

import { buscarGeneros } from "../services/generoService";
import { buscarNacionalidades } from "../services/nacionalidadeService";

import HeaderUsuario from "./headerUsuario";
//import FooterSonara from "./footerUsuario";

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(fotoPerfil);

  const inputFileRef = useRef(null);

  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);

  const [idUsuario, setIdUsuario] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nasc: "",
    nacionalidade_id: "",
    genero_id: "",

    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const usuarioSalvo = sessionStorage.getItem("usuario");

        if (!usuarioSalvo) {
          navigate("/login");
          return;
        }

        const usuarioSession = JSON.parse(usuarioSalvo);

        const response = await buscarUsuarioPorId(usuarioSession.id_usuario);

        const u = response.response.usuario;

        sessionStorage.setItem("usuario", JSON.stringify(u));

        setIdUsuario(u.id_usuario);

        if (u.foto) {
          setFotoPerfilUrl(u.foto);
        }

        const end = u.endereco || {};

        setForm({
          nome: u.nome || "",
          email: u.email || "",
          cpf: u.cpf || "",
          telefone: u.telefone || "",
          data_nasc: u.data_nasc?.split("T")[0] || "",

          nacionalidade_id: u.nacionalidade?.id_nacionalidade || "",

          genero_id: u.genero?.id_genero || "",

          cep: end.cep || "",
          logradouro: end.logradouro || "",
          numero: end.numero || "",
          complemento: end.complemento || "",
          bairro: end.bairro || "",
          cidade: end.cidade || "",
          estado: end.estado || "",
        });

        buscarGeneros()
          .then((data) => setGeneros(data.response?.generos ?? []))
          .catch(() => {});

        buscarNacionalidades()
          .then((data) =>
            setNacionalidades(data.response?.nacionalidades ?? []),
          )
          .catch(() => {});
      } catch (error) {
        console.log(error);
      }
    }

    carregarPerfil();
  }, [navigate]);

  function handleChange(e) {
    setErro("");
    setSucesso("");

    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  }

  const handleFotoClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    setFotoPerfilUrl(URL.createObjectURL(file));

    try {
      const resultado = await atualizarFotoUsuario(idUsuario, file);

      if (resultado.status_code === 200) {
        const u = JSON.parse(sessionStorage.getItem("usuario"));

        u.foto = resultado.response.foto;

        sessionStorage.setItem("usuario", JSON.stringify(u));

        setFotoPerfilUrl(resultado.response.foto);

        setSucesso("Foto atualizada com sucesso!");
      } else {
        setErro(resultado.message || "Erro ao atualizar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  function validarForm() {
    if (!form.nome.trim()) return "Nome é obrigatório.";

    if (!form.email.trim()) return "Email é obrigatório.";

    if (!form.cpf.trim()) return "CPF é obrigatório.";

    if (!form.telefone.trim()) return "Telefone é obrigatório.";

    if (!form.cidade.trim()) return "Cidade é obrigatória.";

    if (!form.estado.trim()) return "Estado é obrigatório.";

    return null;
  }

  async function handleSalvar() {
    if (!idUsuario) return;

    const erroValidacao = validarForm();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);

    try {
      const resultado = await atualizarUsuario(idUsuario, {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        telefone: form.telefone,
        data_nasc: form.data_nasc,

        nacionalidade_id: Number(form.nacionalidade_id),

        genero_id: Number(form.genero_id),

        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
      });

      if (resultado.status_code === 200) {
        setSucesso("Dados atualizados com sucesso!");

        const usuarioAtualizado = resultado.response?.usuario;

        sessionStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

        window.dispatchEvent(new Event("usuarioAtualizado"));
      } else {
        setErro(resultado.message || "Erro ao atualizar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar() {
    if (!idUsuario) return;

    const confirmar = window.confirm("Deseja realmente deletar sua conta?");

    if (!confirmar) return;

    setDeletando(true);

    try {
      const resultado = await deletarUsuario(idUsuario);

      if (resultado.status_code === 200) {
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("token");

        navigate("/");
      } else {
        setErro(resultado.message || "Erro ao deletar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setDeletando(false);
    }
  }

  function handleCancelar() {
    window.location.reload();
  }

  function handleSair() {
    const confirmar = window.confirm("Deseja sair da conta?");

    if (!confirmar) return;

    setSaindo(true);

    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <div className="pu-wrapper">
      <HeaderUsuario />

      <div className="pu-central">
        {/* FOTO */}
        <div className="pu-col-left">
          <div className="pu-foto-wrapper">
            <div className="pu-foto-circle">
              <img
                src={fotoPerfilUrl}
                alt="Usuário"
                onError={(e) => {
                  e.target.src = fotoPerfil;
                }}
              />
            </div>

            <button className="pu-edit-btn" onClick={handleFotoClick}>
              Editar
            </button>

            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* DADOS */}
        <div className="pu-col-right">
          <div className="pu-dados-card">
            <h2 className="pu-card-title">Dados Pessoais</h2>

            <div className="pu-dados-grid">
              <input
                className="pu-input"
                id="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
              />

              <input
                className="pu-input"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                className="pu-input"
                id="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="CPF"
              />

              <input
                className="pu-input"
                id="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
              />

              <input
                className="pu-input"
                id="data_nasc"
                type="date"
                value={form.data_nasc}
                onChange={handleChange}
              />

              <select
                className="pu-input"
                id="nacionalidade_id"
                value={form.nacionalidade_id}
                onChange={handleChange}
              >
                <option value="">Nacionalidade</option>

                {nacionalidades.map((n) => (
                  <option key={n.id_nacionalidade} value={n.id_nacionalidade}>
                    {n.nome}
                  </option>
                ))}
              </select>

              <select
                className="pu-input"
                id="genero_id"
                value={form.genero_id}
                onChange={handleChange}
              >
                <option value="">Gênero</option>

                {generos.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>
                    {g.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCALIZAÇÃO */}
            <h2 className="pu-card-title" style={{ marginTop: "1.5rem" }}>
              Localização
            </h2>

            <div className="pu-dados-grid">
              <input
                className="pu-input"
                id="cep"
                value={form.cep}
                onChange={handleChange}
                placeholder="CEP"
              />

              <input
                className="pu-input"
                id="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                placeholder="Logradouro"
              />

              <input
                className="pu-input"
                id="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Número"
              />

              <input
                className="pu-input"
                id="bairro"
                value={form.bairro}
                onChange={handleChange}
                placeholder="Bairro"
              />

              <input
                className="pu-input"
                id="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />

              <input
                className="pu-input"
                id="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="UF"
              />

              <input
                className="pu-input"
                id="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Complemento"
              />
            </div>

            {erro && (
              <p
                style={{
                  color: "red",
                  marginTop: "1rem",
                }}
              >
                {erro}
              </p>
            )}

            {sucesso && (
              <p
                style={{
                  color: "green",
                  marginTop: "1rem",
                }}
              >
                {sucesso}
              </p>
            )}

            <div className="pu-dados-actions">
              <button
                className="pu-btn pu-btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>

              <button
                className="pu-btn pu-btn-salvar"
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>

              <button
                className="pu-btn pu-btn-sair"
                onClick={handleSair}
                disabled={saindo}
              >
                {saindo ? "Saindo..." : "Sair"}
              </button>

              <button
                className="pu-btn pu-btn-deletar"
                onClick={handleDeletar}
                disabled={deletando}
              >
                {deletando ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <FooterSonara /> */}
    </div>
  );
}
