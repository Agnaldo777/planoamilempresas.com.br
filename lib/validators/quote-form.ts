import { z } from 'zod';

export const quoteFormSchema = z.object({
  tipo_empresa: z.enum(['empresa', 'mei', 'familia', 'individual'], {
    message: 'Selecione o tipo',
  }),
  qtd_vidas: z.enum(['2-5', '6-29', '30-99', '100+'], {
    message: 'Selecione a quantidade',
  }),
  cidade: z.string().min(2, 'Informe sua cidade'),
  nome: z.string().min(2, 'Informe seu nome'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Formato: (11) 99999-9999'),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;
