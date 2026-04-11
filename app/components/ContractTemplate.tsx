"use client";

export interface ChoppItem {
  sabor: string;
  quantidade: string;
  valor: string;
}

export interface ContractData {
  nomeCompleto: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  rg: string;
  cpf: string;
  endereco: string;
  telefone: string;
  dataEvento: string;
  horarioInicio: string;
  horarioFim: string;
  valor: string;
  dataContrato: string;
  incluiChopp: boolean;
  chopps: ChoppItem[];
}

function formatDateBR(value: string): string {
  if (!value) return "";
  // YYYY-MM-DD → DD/MM/YYYY
  const parts = value.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return value;
}

function V({ value, fallback, isDate }: { value: string; fallback: string; isDate?: boolean }) {
  if (!value.trim()) {
    return <span className="field-empty">[{fallback}]</span>;
  }
  const display = isDate ? formatDateBR(value) : value;
  return <span className="field-value">{display}</span>;
}

function parseValue(v: string): number {
  if (!v) return 0;
  return parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ContractTemplate({ data }: { data: ContractData }) {
  const valorEspaco = parseValue(data.valor);
  const valorChopp = data.incluiChopp
    ? data.chopps.reduce((sum, c) => sum + parseValue(c.valor), 0)
    : 0;
  const valorTotal = valorEspaco + valorChopp;

  return (
    <div className="contract-preview" id="contract-content">
      <h1>CONTRATO DE LOCAÇÃO DE ESPAÇO PARA EVENTOS</h1>
      <p className="subtitle">ESPAÇO MAGNIFIC</p>

      <hr className="divider" />

      <h2>1. DAS PARTES</h2>
      <p>
        <strong>CONTRATANTE:</strong>
        <br />
        <V value={data.nomeCompleto} fallback="NOME COMPLETO" />,{" "}
        <V value={data.nacionalidade} fallback="nacionalidade" />,{" "}
        <V value={data.estadoCivil} fallback="estado civil" />,{" "}
        <V value={data.profissao} fallback="profissão" />, portador da Cédula de
        Identidade nº <V value={data.rg} fallback="RG" />, inscrito no CPF sob nº{" "}
        <V value={data.cpf} fallback="CPF" />, residente e domiciliado à{" "}
        <V value={data.endereco} fallback="ENDEREÇO COMPLETO" />, telefone{" "}
        <V value={data.telefone} fallback="TELEFONE" />.
      </p>
      <p>
        <strong>CONTRATADO:</strong>
        <br />
        <strong>SLEUTJES E VEGGI CERVEJARIA E ALIMENTOS LTDA</strong>, pessoa
        jurídica de direito privado, inscrita no CNPJ sob nº{" "}
        <strong>40.058.102/0002-63</strong>, com sede na Rua Professor Villas
        Boucada, nº 680, Bairro Santos Dumont, Juiz de Fora/MG, neste ato
        denominada <strong>&quot;ESPAÇO MAGNIFIC&quot;</strong>.
      </p>
      <p>
        As partes resolvem celebrar o presente Contrato de Locação de Espaço
        para Eventos, que se regerá pelas cláusulas e condições abaixo.
      </p>

      <hr className="divider" />

      <h2>2. DO OBJETO</h2>
      <p>
        O presente contrato tem por objeto a locação do espaço físico denominado{" "}
        <strong>Espaço Magnific</strong>, exclusivamente para realização de
        evento privado do CONTRATANTE, na data e condições estabelecidas neste
        instrumento
        {data.incluiChopp && data.chopps.length > 0 && (
          <>, incluindo o fornecimento de chopp artesanal pela{" "}
          <strong>SleutjesBeer</strong>, conforme especificado na cláusula 5</>
        )}
        .
      </p>
      <p>
        Parágrafo único. A locação refere-se exclusivamente ao espaço físico
        {data.incluiChopp
          ? <> e ao fornecimento de chopp descrito neste contrato</>
          : null
        }
        , não incluindo serviços de buffet, sonorização, iluminação ou qualquer
        outro serviço não expressamente previsto neste contrato.
      </p>

      <hr className="divider" />

      <h2>3. DA DATA, DURAÇÃO E HORÁRIO</h2>
      <ul>
        <li>
          Data do evento: <V value={data.dataEvento} fallback="DATA DO EVENTO" isDate />
        </li>
        <li>
          Horário de início:{" "}
          <V value={data.horarioInicio} fallback="HORÁRIO INÍCIO" />
        </li>
        <li>
          Horário de término:{" "}
          <V value={data.horarioFim} fallback="HORÁRIO TÉRMINO" />
        </li>
      </ul>
      <p>
        §1º O evento deverá ser encerrado{" "}
        impreterivelmente até às{" "}
        <strong><V value={data.horarioFim} fallback="HORÁRIO TÉRMINO" /></strong>.
      </p>
      <p>
        §2º O som em volume elevado é permitido apenas até{" "}
        <strong>22:00</strong>, sendo obrigatório, após esse horário, o uso de
        som ambiente em volume moderado.
      </p>
      <p>
        §3º O descumprimento dos horários implicará multa de{" "}
        <strong>R$ 200,00 (duzentos reais) por hora excedente</strong>, sendo
        considerada fração superior a 15 minutos como hora cheia.
      </p>

      <hr className="divider" />

      <h2>4. DA ESTRUTURA DISPONIBILIZADA</h2>
      <p>O CONTRATADO disponibilizará:</p>
      <ul>
        <li>Mesas</li>
        <li>Cadeiras</li>
        <li>Cozinha</li>
        <li>Freezers</li>
      </ul>
      <p>
        §1º Não estão inclusos equipamentos de som, iluminação, palco ou
        quaisquer outros itens não descritos.
      </p>
      <p>
        §2º O CONTRATANTE declara estar ciente das condições do espaço no ato da
        contratação.
      </p>

      <hr className="divider" />

      <h2>5. DO VALOR E PAGAMENTO</h2>

      {data.incluiChopp && data.chopps.length > 0 ? (
        <>
          <p>O valor total do presente contrato é composto por:</p>
          <p>
            <strong>a) Locação do espaço:</strong> R${" "}
            <V value={data.valor} fallback="VALOR" />
          </p>
          <p>
            <strong>b) Fornecimento de Chopp Artesanal — SleutjesBeer:</strong>
          </p>
          <ul>
            {data.chopps.map((c, i) => (
              <li key={i}>
                <V value={c.sabor} fallback="SABOR" /> —{" "}
                <V value={c.quantidade} fallback="QTD" /> litros — R${" "}
                <V value={c.valor} fallback="VALOR" />
              </li>
            ))}
          </ul>
          <p>
            <strong>
              Valor total (Espaço + Chopp): R$ {formatBRL(valorTotal)}
            </strong>
          </p>
        </>
      ) : (
        <p>
          Valor total: <strong>R$ <V value={data.valor} fallback="VALOR" /></strong>
        </p>
      )}

      <p>Forma de pagamento:</p>
      <ul>
        <li>
          <strong>50% a título de sinal, no ato da reserva</strong>
        </li>
        <li>
          <strong>50% restantes até 24 horas antes do evento</strong>
        </li>
      </ul>
      <p>
        §1º O não pagamento integral até o prazo estipulado autoriza o
        CONTRATADO a cancelar a reserva, sem devolução do sinal.
      </p>
      <p>
        §2º São aceitas as formas de pagamento: Pix, cartão e parcelamento,
        conforme condições comerciais vigentes.
      </p>

      {data.incluiChopp && data.chopps.length > 0 && (
        <>
          <p>
            §3º O fornecimento de chopp artesanal será realizado pela{" "}
            <strong>SleutjesBeer</strong>, marca pertencente ao CONTRATADO,
            incluindo a disponibilização de chopeira(s) e acessórios necessários
            para o serviço durante o evento.
          </p>
          <p>
            §4º A quantidade de chopp contratada é estimada. Eventuais
            acréscimos durante o evento serão cobrados separadamente, conforme
            tabela de preços vigente.
          </p>
        </>
      )}

      <hr className="divider" />

      <h2>6. DO CANCELAMENTO E RESCISÃO POR INICIATIVA DO CONTRATANTE</h2>
      <p>
        §1º O valor pago a título de sinal possui natureza de{" "}
        <strong>cláusula penal compensatória</strong>, não sendo reembolsável em
        nenhuma hipótese.
      </p>
      <p>§2º Em caso de cancelamento:</p>
      <ul>
        <li>
          Com mais de 30 dias de antecedência:
          <br />→ poderá ser devolvido até{" "}
          <strong>30% do valor pago, excluído o sinal</strong>
        </li>
        <li>
          Entre 30 e 15 dias:
          <br />→ poderá ser devolvido até{" "}
          <strong>20% do valor pago, excluído o sinal</strong>
        </li>
        <li>
          Com menos de 15 dias:
          <br />→ <strong>não haverá devolução de qualquer valor</strong>
        </li>
      </ul>
      <p>§3º A eventual devolução ocorrerá em até 15 dias úteis.</p>

      <hr className="divider" />

      <h2>7. DA CAPACIDADE E SEGURANÇA</h2>
      <p>
        §1º O limite máximo de ocupação do espaço é de{" "}
        <strong>100 (cem) pessoas</strong>, incluindo convidados, prestadores de
        serviço e equipe.
      </p>
      <p>§2º O CONTRATANTE é integralmente responsável:</p>
      <ul>
        <li>Pela segurança do evento</li>
        <li>Pela conduta de seus convidados</li>
        <li>Pela contratação de equipe de apoio, se necessário</li>
      </ul>
      <p>
        §3º O descumprimento da capacidade máxima poderá resultar na interrupção
        imediata do evento, sem direito a reembolso.
      </p>

      <hr className="divider" />

      <h2>8. DAS CONDIÇÕES DE USO</h2>
      <p>É permitido:</p>
      <ul>
        <li>Entrada de buffet externo</li>
        <li>Entrada de bebidas</li>
        <li>Contratação de DJ ou som próprio</li>
        <li>Decoração, desde que não cause danos</li>
      </ul>
      <p>É expressamente proibido:</p>
      <ul>
        <li>Som alto após 22:00</li>
        <li>Ultrapassar a capacidade máxima</li>
        <li>
          Fixar objetos com pregos, parafusos, fitas agressivas ou qualquer
          material que danifique o espaço
        </li>
        <li>
          Utilizar fogos de artifício, materiais inflamáveis ou explosivos
        </li>
        <li>Realizar atividades ilícitas</li>
        <li>Utilizar o espaço para finalidade diversa da contratada</li>
      </ul>

      <hr className="divider" />

      <h2>9. DA LIMPEZA</h2>
      <p>
        A limpeza padrão do espaço está incluída no valor da locação.
      </p>
      <p>
        §1º O CONTRATANTE obriga-se a devolver o espaço em condições mínimas de
        uso.
      </p>
      <p>
        §2º Em caso de sujeira excessiva ou descarte inadequado de resíduos,
        poderá ser cobrada taxa adicional.
      </p>

      <hr className="divider" />

      <h2>10. DA RESPONSABILIDADE CIVIL E DANOS</h2>
      <p>
        §1º O CONTRATANTE responde integralmente por quaisquer danos causados ao
        imóvel, mobiliário, equipamentos ou terceiros, por si ou por seus
        convidados.
      </p>
      <p>
        §2º Os custos de reparo ou reposição deverão ser pagos no prazo máximo de{" "}
        <strong>05 (cinco) dias úteis</strong> após notificação.
      </p>
      <p>
        §3º O não pagamento autoriza a cobrança judicial, acrescida de correção,
        juros e honorários.
      </p>

      <hr className="divider" />

      <h2>11. DA LIMITAÇÃO DE RESPONSABILIDADE</h2>
      <p>O CONTRATADO não se responsabiliza por:</p>
      <ul>
        <li>Objetos pessoais deixados no local</li>
        <li>Acidentes decorrentes de conduta dos convidados</li>
        <li>Serviços contratados por terceiros</li>
      </ul>

      <hr className="divider" />

      <h2>12. CASO FORTUITO E FORÇA MAIOR</h2>
      <p>
        O CONTRATADO não será responsabilizado por eventos decorrentes de caso
        fortuito ou força maior, incluindo, mas não se limitando a:
      </p>
      <ul>
        <li>Falta de energia externa</li>
        <li>Chuvas intensas</li>
        <li>Interdições públicas</li>
        <li>Determinações legais ou sanitárias</li>
      </ul>

      <hr className="divider" />

      <h2>13. DA RESCISÃO</h2>
      <p>
        O descumprimento de qualquer cláusula autoriza o CONTRATADO a rescindir o
        contrato de forma imediata, sem devolução de valores.
      </p>

      <hr className="divider" />

      <h2>14. DO FORO</h2>
      <p>
        Fica eleito o foro da comarca de <strong>Juiz de Fora/MG</strong>, com
        renúncia a qualquer outro, por mais privilegiado que seja.
      </p>

      <hr className="divider" />

      <h2>15. DISPOSIÇÕES FINAIS</h2>
      <p>§1º Este contrato constitui o acordo integral entre as partes.</p>
      <p>§2º Qualquer tolerância não implicará renúncia de direitos.</p>
      <p>
        §3º O CONTRATANTE declara ter lido, compreendido e concordado
        integralmente com todas as cláusulas.
      </p>

      <hr className="divider" />

      <div className="signature-block">
        <p>
          <strong>
            Juiz de Fora/MG,{" "}
            <V value={data.dataContrato} fallback="DATA" isDate />
          </strong>
        </p>

        <div className="signature-line">CONTRATANTE</div>

        <div className="signature-line">ESPAÇO MAGNIFIC</div>
      </div>
    </div>
  );
}
