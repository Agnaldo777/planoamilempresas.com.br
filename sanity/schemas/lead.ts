import { defineField, defineType } from 'sanity';

export const lead = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'tipo_empresa',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Empresa', value: 'empresa' },
          { title: 'MEI', value: 'mei' },
          { title: 'Família', value: 'familia' },
          { title: 'Individual', value: 'individual' },
        ],
      },
    }),
    defineField({ name: 'qtd_vidas', title: 'Quantidade de Vidas', type: 'string' }),
    defineField({ name: 'cidade', title: 'Cidade', type: 'string' }),
    defineField({ name: 'plano_interesse', title: 'Plano de Interesse', type: 'string' }),
    defineField({ name: 'utm_source', title: 'UTM Source', type: 'string' }),
    defineField({ name: 'utm_medium', title: 'UTM Medium', type: 'string' }),
    defineField({
      name: 'created_at',
      title: 'Data',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  orderings: [
    { title: 'Data (recente)', name: 'createdDesc', by: [{ field: 'created_at', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nome', subtitle: 'tipo_empresa' },
  },
});
