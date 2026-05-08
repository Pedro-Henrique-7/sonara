import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";
import logo from "./img/sonara-logo.svg";
import { cadastrarUsuario } from "./services/usuarioService";
import { cadastrarEndereco, buscarCep, buscarLatLong } from "./services/enderecoService";
import { buscarGeneros } from "./services/generoService";
import { buscarNacionalidades } from "./services/nacionalidadeService";

function Cadastro() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Listas vindas do banco
  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    email: "",
    "confirm-email": "",
    tel: "",
    senha: "",
    "confirm-senha": "",
    id_nacionalidade: "",
    id_genero: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    localidade: "",
    estado: "",
    latitude: "",
    longitude: "",
    complemento: "",
  });

  // Busca gêneros e nacionalidades ao montar o componente
  useEffect(() => {
  buscarGeneros()
    .then((data) => setGeneros(data.response.generos ?? []))
    .catch(() => setErro("Erro ao carregar gêneros."));

  buscarNacionalidades()
    .then((data) => setNacionalidades(data.response.nacionalidades ?? []))
    .catch(() => setErro("Erro ao carregar nacionalidades."));
}, []);

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      setBuscandoCep(true);
      const dados = await buscarCep(cepLimpo);

      if (dados.erro) {
        setErro("CEP não encontrado.");
        return;
      }

      const enderecoString = `${dados.logradouro}, ${dados.localidade}, ${dados.uf}, Brasil`;
      const coordenadas = await buscarLatLong(enderecoString);

      setForm((prev) => ({
        ...prev,
        logradouro: dados.logradouro || "",
        bairro: dados.bairro || "",
        localidade: dados.localidade || "",
        estado: dados.uf || "",
        latitude: coordenadas?.lat || "",
        longitude: coordenadas?.lng || "",
        complemento: dados.complemento || "",
      }));
    } catch {
      setErro("Erro ao buscar CEP. Preencha o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (form.email !== form["confirm-email"]) {
      setErro("Os emails não coincidem.");
      return;
    }
    if (form.senha !== form["confirm-senha"]) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      // PASSO 1: Cadastrar endereço
      const endereco = {
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.localidade,
        estado: form.estado,
        latitude: form.latitude,
        longitude: form.longitude,
        complemento: form.complemento,
      };

      const respostaEndereco = await cadastrarEndereco(endereco);
      console.log("Resposta Endereço:", respostaEndereco);
      if (respostaEndereco.erro || !respostaEndereco.response.id) {
        setErro(respostaEndereco.mensagem || "Erro ao cadastrar endereço.");
        return;
      }

      //Cadastrar usuário
      const usuario = {
        nome: form.nome,
        cpf: form.cpf,
        data_nascimento: form.nascimento,
        email: form.email,
        telefone: form.tel,
        senha: form.senha,
        nacionalidade_id: Number(form.id_nacionalidade),
        genero_id: Number(form.id_genero),
        endereco_id: respostaEndereco.response.id,
      };


      const respostaUsuario = await cadastrarUsuario(usuario);
      console.log("Resposta Usuário:", respostaUsuario);

      if (respostaUsuario.erro) {
        setErro(respostaUsuario.mensagem || "Erro ao cadastrar usuário.");
        return;
      }

      setSucesso(true);
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo Sonara" />
        <p>CADASTRO</p>
      </header>

      <main>
        <form className="cadastro-form" autoComplete="off" onSubmit={handleSubmit}>
          {/* DADOS PESSOAIS */}
          <section className="secao-dados">
            <h3>Dados Pessoais</h3>

            {/* LINHA 1 */}
            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Digite seu nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="nascimento">Data de Nascimento</label>
                <input
                  type="date"
                  id="nascimento"
                  value={form.nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* LINHA 2 */}
            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Seu email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="confirm-email">Confirmar Email</label>
                <input
                  type="email"
                  id="confirm-email"
                  placeholder="Repita o email"
                  value={form["confirm-email"]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="tel">Telefone</label>
                <input
                  type="tel"
                  id="tel"
                  placeholder="(00) 00000-0000"
                  value={form.tel}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* LINHA 3 */}
            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Crie uma senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="confirm-senha">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirm-senha"
                  placeholder="Repita a senha"
                  value={form["confirm-senha"]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="id_genero">Gênero</label>
                <select
                  id="id_genero"
                  value={form.id_genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {generos.map((genero) => (
                    <option key={genero.id_genero} value={genero.id_genero}>
                      {genero.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LINHA 4 */}
            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="id_nacionalidade">Nacionalidade</label>
                <select
                  id="id_nacionalidade"
                  value={form.id_nacionalidade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {nacionalidades.map((nacionalidade) => (
                    <option key={nacionalidade.id_nacionalidade} value={nacionalidade.id_nacionalidade}>
                      {nacionalidade.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ENDEREÇO */}
          <section className="secao-endereco">
            <h3>Endereço</h3>

            <div className="grid-endereco">
              <div className="campo cep">
                <label htmlFor="cep">
                  CEP {buscandoCep && <span className="buscando-cep">Buscando...</span>}
                </label>
                <input
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                  maxLength="9"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  required
                />
              </div>

              <div className="campo rua">
                <label htmlFor="logradouro">Rua</label>
                <input
                  type="text"
                  id="logradouro"
                  placeholder="Rua, Avenida..."
                  value={form.logradouro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo numero">
                <label htmlFor="numero">Nº</label>
                <input
                  type="text"
                  id="numero"
                  value={form.numero}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo bairro">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  id="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo cidade">
                <label htmlFor="localidade">Cidade</label>
                <input
                  type="text"
                  id="localidade"
                  value={form.localidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo uf">
                <label htmlFor="estado">UF</label>
                <input
                  type="text"
                  id="estado"
                  maxLength="2"
                  value={form.estado}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo complemento">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  maxLength="100"
                  value={form.complemento}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* FEEDBACK */}
          {erro && <p className="mensagem-erro">{erro}</p>}
          {sucesso && <p className="mensagem-sucesso">Cadastro realizado! Redirecionando...</p>}

          {/* BOTÕES */}
          <div className="botoes">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate("/login")}
            >
              Já tenho conta
            </button>

            <button
              type="submit"
              className="btn-primario"
              disabled={carregando || buscandoCep}
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;