import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";
import logo from "../img/sonara-logo.svg";
import { cadastrarUsuario } from "../services/usuarioService";
import { buscarCep, buscarLatLong } from "../services/enderecoService";
import { buscarGeneros } from "../services/generoService";
import { buscarNacionalidades } from "../services/nacionalidadeService";
import { buscarGeneroMusical } from "../services/generoMusicalService";

function Cadastro() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);
  const [generosMusical, setGenerosMusical] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    "confirm-email": "",
    senha: "",
    "confirm-senha": "",
    cpf: "",
    data_nasc: "",        
    nacionalidade_id: "",
    genero_id: "",
    telefone: "",
    tipo_usuario: "",
    nome_artistico: "",
    descricao: "",
    generos_musicais: [],
    cep: "",
    cidade: "",
    estado: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
  });

  useEffect(() => {
    buscarGeneros()
      .then((data) => setGeneros(data.response.generos ?? []))
      .catch(() => setErro("Erro ao carregar gêneros."));

    buscarNacionalidades()
      .then((data) => setNacionalidades(data.response.nacionalidades ?? []))
      .catch(() => setErro("Erro ao carregar nacionalidades."));

    buscarGeneroMusical()
      .then((data) => setGenerosMusical(data.response.GeneroMusical ?? []))
      .catch(() => setErro("Erro ao carregar Gêneros Musicais."));
  }, []);

  function handleChange(e) {
    setErro("");
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }));
  }


  function handleGeneroMusicalChange(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setForm((prev) => ({ ...prev, generos_musicais: selecionados }));
  }

  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      setBuscandoCep(true);
      const dados = await buscarCep(cepLimpo);
      console.log("dados cep: " + dados)
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
        cidade: dados.localidade || "", 
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
    if (form.senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }


    if (form.tipo_usuario === "artista" && form.generos_musicais.length === 0) {
      setErro("Selecione pelo menos um gênero musical.");
      return;
    }

    try {
      setCarregando(true);

      const hoje = new Date().toISOString().split("T")[0]

      const usuario = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: form.cpf,
        data_nasc: form.data_nasc,
        nacionalidade_id: Number(form.nacionalidade_id),
        genero_id: Number(form.genero_id),
        telefone: form.telefone,     
        tipo_usuario: form.tipo_usuario,
        nome_artistico: form.nome_artistico,
        descricao: form.descricao,
        generos_musicais: form.generos_musicais,
        cep: form.cep,
        cidade: form.cidade,
        estado: form.estado,
        logradouro: form.logradouro,
        numero: form.numero, 
        complemento: form.complemento,
        bairro: form.bairro,
      };

      const respostaUsuario = await cadastrarUsuario(usuario);

      if (respostaUsuario.status_code !== 201) {
        setErro(respostaUsuario.message || "Erro ao cadastrar usuário.");
        return;
      }

      setSucesso(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(err.message || "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container">
      <header className="header-cadastro">
        <img src={logo} alt="Logo Sonara" />
        <p className="nome-cadastro">CADASTRO</p>
      </header>

      <main>
        <form className="cadastro-form" autoComplete="off" onSubmit={handleSubmit}>

          {/* DADOS PESSOAIS */}
          <section className="secao-dados">
            <h3>Dados Pessoais</h3>

            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" placeholder="Digite seu nome"
                  value={form.nome} onChange={handleChange} required />
              </div>

              <div className="campo">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" placeholder="000.000.000-00"
                  value={form.cpf} onChange={handleChange} required />
              </div>

              <div className="campo">
                <label htmlFor="data_nasc">Data de Nascimento</label>
                <input type="date" id="data_nasc"
                  value={form.data_nasc} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Seu email"
                  value={form.email} onChange={handleChange} required />
              </div>

              <div className="campo">
                <label htmlFor="confirm-email">Confirmar Email</label>
                <input type="email" id="confirm-email" placeholder="Repita o email"
                  value={form["confirm-email"]} onChange={handleChange} required />
              </div>


              <div className="campo">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" placeholder="(00) 00000-0000"
                  value={form.telefone} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-duplo">
              <div className="campo">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" placeholder="Crie uma senha"
                  value={form.senha} onChange={handleChange} required />
              </div>

              <div className="campo">
                <label htmlFor="confirm-senha">Confirmar Senha</label>
                <input type="password" id="confirm-senha" placeholder="Repita a senha"
                  value={form["confirm-senha"]} onChange={handleChange} required />
              </div>

              <div className="campo">
                <label htmlFor="genero_id">Gênero</label>
                <select id="genero_id" value={form.genero_id} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {generos.map((genero) => (
                    <option key={genero.id_genero} value={genero.id_genero}>
                      {genero.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grupo-duplo">

              <div className="campo">
                <label htmlFor="nacionalidade_id">Nacionalidade</label>
                <select id="nacionalidade_id" value={form.nacionalidade_id} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {nacionalidades.map((nacionalidade) => (
                    <option key={nacionalidade.id_nacionalidade} value={nacionalidade.id_nacionalidade}>
                      {nacionalidade.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label htmlFor="tipo_usuario">Tipo de Usuário</label>
                <select id="tipo_usuario" value={form.tipo_usuario} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  <option value="artista">Artista</option>
                  <option value="organizador">Organizador</option>
                  <option value="user">Usuário</option>
                </select>
              </div>


              {form.tipo_usuario === "artista" && (
                <div className="campo">
                  <label htmlFor="generos_musicais">Gêneros Musicais</label>
                  <select id="generos_musicais" multiple
                    value={form.generos_musicais} onChange={handleGeneroMusicalChange} required>
                    {generosMusical.map((genero) => (
                      <option key={genero.id_genero_musical} value={genero.id_genero_musical}>
                        {genero.nome}
                      </option>
                    ))}
                  </select>
                  <small>Segure Ctrl para selecionar mais de um</small>
                </div>
              )}
            </div>

            {form.tipo_usuario === "artista" && (
              <div className="grupo-duplo">
                <div className="campo">
                  <label htmlFor="nome_artistico">Nome Artístico</label>
                  <input type="text" id="nome_artistico" placeholder="Seu nome artístico"
                    value={form.nome_artistico} onChange={handleChange} required />
                </div>

                <div className="campo">
                  <label htmlFor="descricao">Descrição</label>
                  <input type="text" id="descricao" placeholder="Fale sobre você"
                    value={form.descricao} onChange={handleChange} />
                </div>
              </div>
            )}
          </section>


          <section className="secao-endereco">
            <h3>Endereço</h3>

            <div className="grid-endereco">
              <div className="campo cep">
                <label htmlFor="cep">
                  CEP {buscandoCep && <span className="buscando-cep">Buscando...</span>}
                </label>
                <input type="text" id="cep" placeholder="00000-000" maxLength="9"
                  value={form.cep} onChange={handleChange} onBlur={handleCepBlur} required />
              </div>

              <div className="campo rua">
                <label htmlFor="logradouro">Rua</label>
                <input type="text" id="logradouro" placeholder="Rua, Avenida..."
                  value={form.logradouro} onChange={handleChange} required />
              </div>

              <div className="campo numero">
                <label htmlFor="numero">Nº</label>
                <input type="text" id="numero"
                  value={form.numero} onChange={handleChange} required />
              </div>

              <div className="campo bairro">
                <label htmlFor="bairro">Bairro</label>
                <input type="text" id="bairro"
                  value={form.bairro} onChange={handleChange} required />
              </div>

     
              <div className="campo cidade">
                <label htmlFor="cidade">Cidade</label>
                <input type="text" id="cidade"
                  value={form.cidade} onChange={handleChange} required />
              </div>

              <div className="campo uf">
                <label htmlFor="estado">UF</label>
                <input type="text" id="estado" maxLength="2"
                  value={form.estado} onChange={handleChange} required />
              </div>

              <div className="campo complemento">
                <label htmlFor="complemento">Complemento</label>
                <input type="text" id="complemento" maxLength="100"
                  value={form.complemento} onChange={handleChange} />
              </div>
            </div>
          </section>

          {erro && <p className="mensagem-erro">{erro}</p>}
          {sucesso && <p className="mensagem-sucesso">Cadastro realizado! Redirecionando...</p>}

          <div className="botoes">
            <button type="button" className="btn-secundario" onClick={() => navigate("/login")}>
              Já tenho conta
            </button>
            <button type="submit" className="btn-primario" disabled={carregando || buscandoCep}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

export default Cadastro;