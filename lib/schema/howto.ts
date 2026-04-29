/**
 * Schema HowTo — Story 3.20 (FR39)
 *
 * Constrói nó `HowTo` schema.org para tutoriais step-by-step embedados
 * em páginas como `/carencias` (Calculadora de Carências). Útil para
 * Featured Snippet "rich result" do Google em queries do tipo
 * "como calcular carência amil".
 *
 * **Compliance:**
 *   - FR39: tutorial estruturado complementa a calculadora interativa
 *   - NFR21: schema coverage mínima
 *   - Schema.org HowTo spec: name, step (HowToStep array), supply opcional
 */

export interface HowToStepInput {
  /** Nome curto do passo (ex: "Informe a data de contratação"). */
  name: string;
  /** Texto descritivo do passo. */
  text: string;
  /** Âncora interna opcional (ex: '#step-1'). */
  url?: string;
}

export interface HowToInput {
  /** Nome do tutorial (ex: "Como calcular sua carência Amil"). */
  name: string;
  /** Descrição curta (default: usa `name`). */
  description?: string;
  /** Lista ordenada de passos (≥1). */
  steps: readonly HowToStepInput[];
  /** Tempo total estimado em formato ISO 8601 duration (ex: 'PT2M' = 2 min). */
  totalTime?: string;
}

export interface HowToNode {
  '@type': 'HowTo';
  name: string;
  description: string;
  step: Array<{
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
    url?: string;
  }>;
  totalTime?: string;
}

/**
 * Constrói nó HowTo schema.org.
 *
 * @throws Error se `steps` vazio ou `name` ausente.
 */
export function buildHowToNode(opts: HowToInput): HowToNode {
  if (!opts.name || typeof opts.name !== 'string') {
    throw new Error('[howto] name é obrigatório (string).');
  }
  if (!opts.steps || opts.steps.length === 0) {
    throw new Error('[howto] steps não pode estar vazio.');
  }

  return {
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description ?? opts.name,
    step: opts.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
    })),
    ...(opts.totalTime && { totalTime: opts.totalTime }),
  };
}
