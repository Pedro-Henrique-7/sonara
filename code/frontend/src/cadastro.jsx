import { Navigate } from "react-router-dom";
import "./cadastro.css";
import logo from "./img/sonara-logo.svg";
import { useState } from "react";

function Cadastro() {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo Sonara" />
        <p>CADASTRO</p>
      </header>

      <main>
        <form className="cadastro-form" autoComplete="off">
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
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="nascimento">Data de Nascimento</label>
                <input type="date" id="nascimento" required />
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
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="confirm-email">Confirmar Email</label>
                <input
                  type="email"
                  id="confirm-email"
                  placeholder="Repita o email"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="tel">Telefone</label>
                <input
                  type="tel"
                  id="tel"
                  placeholder="(00) 00000-0000"
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
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="confirm-senha">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirm-senha"
                  placeholder="Repita a senha"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="nacionalidade">Nacionalidade</label>
                <select id="nacionalidade" required>
                  <option value="">Selecione...</option>
                  <option value="brasileira">Brasileira</option>
                  <option value="portuguesa">Portuguesa</option>
                  <option value="angolana">Angolana</option>
                </select>
              </div>
            </div>
          </section>

          {/* ENDEREÇO */}
          <section className="secao-endereco">
            <h3>Endereço</h3>

            <div className="grid-endereco">
              <div className="campo cep">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                  maxLength="9"
                  required
                />
              </div>

              <div className="campo rua">
                <label htmlFor="logradouro">Rua</label>
                <input
                  type="text"
                  id="logradouro"
                  placeholder="Rua, Avenida..."
                  required
                />
              </div>

              <div className="campo numero">
                <label htmlFor="numero">Nº</label>
                <input type="text" id="numero" required />
              </div>

              <div className="campo bairro">
                <label htmlFor="bairro">Bairro</label>
                <input type="text" id="bairro" required />
              </div>

              <div className="campo cidade">
                <label htmlFor="localidade">Cidade</label>
                <input type="text" id="localidade" required />
              </div>

              <div className="campo uf">
                <label htmlFor="uf">UF</label>
                <input type="text" id="uf" maxLength="2" required />
              </div>
            </div>
          </section>

          <button onClick={() => navigate("/login")}>Fazer Login</button>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;
