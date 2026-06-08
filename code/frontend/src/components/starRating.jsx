import { useState, useEffect, useRef } from "react"
import { FaStar } from "react-icons/fa"

export default function StarRating({ onRate, mediaAtual, totalAvaliacoes, usuario_id, entityId, buscarAvaliacao }) {
    const [hoverNota, setHoverNota] = useState(0)
    const [notaAtual, setNotaAtual] = useState(0)
    const [enviando, setEnviando] = useState(false)
    const [mensagem, setMensagem] = useState(null)
    const avaliacaoIdRef = useRef(null)

    useEffect(() => {
        if (!usuario_id || !entityId || !buscarAvaliacao) return
        buscarAvaliacao(usuario_id, entityId)
            .then(avaliacao => {
                console.log('avaliacao retornada:', avaliacao)
                if (avaliacao?.numero_estrelas) {
                    setNotaAtual(avaliacao.numero_estrelas)
                    avaliacaoIdRef.current = avaliacao?.id_avaliacao_evento ?? null
                }
            })
            .catch(() => { })
    }, [usuario_id, entityId, buscarAvaliacao])

    async function handleClick(valor) {
        if (enviando) return
        const notaAnterior = notaAtual
        setNotaAtual(valor)
        setEnviando(true)
        setMensagem(null)
        try {
            console.log('avaliacaoId enviado pro onRate:', avaliacaoIdRef.current)
            await onRate(valor, avaliacaoIdRef.current)
            const acao = notaAnterior > 0 ? "Avaliação atualizada!" : "Avaliação enviada!"

            if (!avaliacaoIdRef.current) {
                const avaliacao = await buscarAvaliacao(usuario_id, entityId)
                avaliacaoIdRef.current = avaliacao?.id_avaliacao_evento ?? null
            }

            setMensagem({ tipo: "ok", texto: acao })
            setTimeout(() => setMensagem(null), 3000)
        } catch (err) {
            setNotaAtual(notaAnterior)
            setMensagem({ tipo: "erro", texto: err.message || "Erro ao avaliar." })
            setTimeout(() => setMensagem(null), 4000)
        } finally {
            setEnviando(false)
        }
    }

    const notaVisual = hoverNota || notaAtual

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((val) => (
                    <FaStar
                        key={val}
                        title={`Avaliar ${val} estrela${val > 1 ? "s" : ""}`}
                        style={{
                            fontSize: "1.6rem",
                            cursor: enviando ? "wait" : "pointer",
                            color: val <= notaVisual ? "#ffe600" : "rgba(255,255,255,0.3)",
                            transition: "color 0.15s, transform 0.1s",
                            transform: val <= notaVisual ? "scale(1.15)" : "scale(1)",
                        }}
                        onMouseEnter={() => { if (!enviando) setHoverNota(val) }}
                        onMouseLeave={() => setHoverNota(0)}
                        onClick={() => handleClick(val)}
                    />
                ))}

                {enviando && (
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginLeft: "6px" }}>
                        Salvando...
                    </span>
                )}

                {notaAtual > 0 && !enviando && (
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>
                        Sua nota: {notaAtual}
                    </span>
                )}
            </div>

            {mediaAtual > 0 && (
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                    Média: {Number(mediaAtual).toFixed(1)} ({totalAvaliacoes || 0} avaliações)
                </span>
            )}

            {mensagem && (
                <span style={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: mensagem.tipo === "ok" ? "#6ee99a" : "#ffb3a7",
                }}>
                    {mensagem.texto}
                </span>
            )}
        </div>
    )
}