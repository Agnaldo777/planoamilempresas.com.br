'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Store, Users, User } from 'lucide-react';
import { quoteFormSchema, type QuoteFormData } from '@/lib/validators/quote-form';

const steps = ['Tipo', 'Vidas', 'Região', 'Dados'];

const tipoOptions = [
  { value: 'empresa', label: 'Empresa', icon: Building2, desc: 'CNPJ ativo' },
  { value: 'mei', label: 'MEI', icon: Store, desc: 'Microempreendedor' },
  { value: 'familia', label: 'Família', icon: Users, desc: '2+ pessoas' },
  { value: 'individual', label: 'Individual', icon: User, desc: 'Pessoa física' },
] as const;

const vidasOptions = ['2-5', '6-29', '30-99', '100+'] as const;

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
  });

  const tipoValue = watch('tipo_empresa');
  const vidasValue = watch('qtd_vidas');

  async function nextStep() {
    const fieldsPerStep: (keyof QuoteFormData)[][] = [
      ['tipo_empresa'],
      ['qtd_vidas'],
      ['cidade'],
      ['nome', 'whatsapp'],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid && step < 3) setStep(step + 1);
  }

  async function onSubmit(data: QuoteFormData) {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-cta-green/10 p-8 text-center">
        <p className="text-2xl font-bold text-cta-green">Cotação enviada!</p>
        <p className="mt-2 text-gray-700">
          Você receberá sua proposta no WhatsApp em instantes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-6 ${i < step ? 'bg-slate-900' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Tipo */}
      {step === 0 && (
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold">Quem é você?</h3>
          <div className="grid grid-cols-2 gap-3">
            {tipoOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setValue('tipo_empresa', opt.value);
                    nextStep();
                  }}
                  className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
                    tipoValue === opt.value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-gray-200 hover:border-slate-700/50'
                  }`}
                >
                  <Icon className="h-8 w-8 text-slate-700" />
                  <span className="mt-2 font-semibold text-gray-900">{opt.label}</span>
                  <span className="text-xs text-gray-500">{opt.desc}</span>
                </button>
              );
            })}
          </div>
          {errors.tipo_empresa && (
            <p className="mt-2 text-center text-sm text-urgency">{errors.tipo_empresa.message}</p>
          )}
        </div>
      )}

      {/* Step 2: Vidas */}
      {step === 1 && (
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold">Quantas pessoas?</h3>
          <div className="space-y-3">
            {vidasOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setValue('qtd_vidas', opt);
                  nextStep();
                }}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all ${
                  vidasValue === opt
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-gray-200 hover:border-slate-700/50'
                }`}
              >
                {opt} {opt === '100+' ? 'vidas' : 'pessoas'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Região */}
      {step === 2 && (
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold">Qual sua região?</h3>
          <input
            {...register('cidade')}
            placeholder="Digite sua cidade"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-600"
          />
          {errors.cidade && (
            <p className="mt-2 text-sm text-urgency">{errors.cidade.message}</p>
          )}
          <button
            type="button"
            onClick={nextStep}
            className="mt-4 w-full rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-500"
          >
            Próximo →
          </button>
        </div>
      )}

      {/* Step 4: Dados */}
      {step === 3 && (
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold">Seus dados</h3>
          <div className="space-y-3">
            <div>
              <input
                {...register('nome')}
                placeholder="Seu nome"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-600"
              />
              {errors.nome && <p className="mt-1 text-sm text-urgency">{errors.nome.message}</p>}
            </div>
            <div>
              <input
                {...register('whatsapp')}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-600"
              />
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-urgency">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-cta-green px-4 py-4 text-lg font-bold text-white transition-colors hover:bg-cta-green-hover"
          >
            Receber Cotação Grátis
          </button>
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < 3 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-sky-600"
        >
          ← Voltar
        </button>
      )}
      {step === 3 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-3 w-full text-center text-sm text-gray-500 hover:text-sky-600"
        >
          ← Voltar
        </button>
      )}
    </form>
  );
}
