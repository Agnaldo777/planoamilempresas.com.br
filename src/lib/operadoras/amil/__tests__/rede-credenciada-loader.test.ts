/**
 * Tests Story 7.1 AC2 + AC3 + AC4 + AC5 + AC7 — loader canônico Epic 7.
 *
 * Cobre todos os 14 helpers exportados + slugify + inferTipoAtendimento.
 * Validações contra dataset commitado (2026-04-26): 9.325 prestadores · 26 UFs · 438 municípios.
 *
 * Coverage gate: ≥80% loader (heavy-branching) + ≥85% funções puras.
 */

import { afterEach, describe, expect, it } from 'vitest';

import {
  __resetCacheForTests,
  getAllPrestadores,
  getBairrosDoMunicipio,
  getDatasetMetadata,
  getEstatisticasByUF,
  getEstatisticasRede,
  getMunicipios,
  getMunicipioBySlug,
  getMunicipiosByUf,
  getPrestadorBySlug,
  getPrestadoresPorBairro,
  getPrestadoresPorMunicipio,
  getPrestadoresPorRede,
  getPrestadoresPorTipo,
  getTopMunicipios,
  inferTipoAtendimento,
  prestadorSlug,
  slugify,
} from '@/lib/operadoras/amil/rede-credenciada-loader';
import type { PrestadorAmil } from '@/types/rede-credenciada-amil';

afterEach(() => {
  __resetCacheForTests();
});

// ─── slugify (AC5) ───────────────────────────────────────────────────────

describe('slugify()', () => {
  it('remove acentos NFD', () => {
    expect(slugify('São Paulo')).toBe('sao-paulo');
    expect(slugify('Brasília')).toBe('brasilia');
    expect(slugify('Niterói')).toBe('niteroi');
    expect(slugify('São Gonçalo')).toBe('sao-goncalo');
  });

  it('lowercase + non-alnum vira hífen', () => {
    expect(slugify('Belo Horizonte')).toBe('belo-horizonte');
    expect(slugify('CIDADE  COM   ESPAÇOS  MÚLTIPLOS')).toBe('cidade-com-espacos-multiplos');
  });

  it('remove símbolos e caracteres especiais', () => {
    expect(slugify('Centro Médico (Filial)')).toBe('centro-medico-filial');
    expect(slugify("D'Or São Luiz")).toBe('dor-sao-luiz');
  });

  it('aceita string vazia sem quebrar', () => {
    expect(slugify('')).toBe('');
  });

  it('aceita números', () => {
    expect(slugify('S380 QP')).toBe('s380-qp');
    expect(slugify('Setor 12 - Sul')).toBe('setor-12-sul');
  });

  it('é idempotente (slugify(slugify(x)) === slugify(x))', () => {
    const inputs = ['São Paulo', 'Brasília', 'AMIL S750 QP', 'Centro Médico Família'];
    for (const input of inputs) {
      const once = slugify(input);
      const twice = slugify(once);
      expect(twice).toBe(once);
    }
  });
});

// ─── inferTipoAtendimento (AC3) ──────────────────────────────────────────

describe('inferTipoAtendimento()', () => {
  it('reconhece Hospital pelos padrões "HOSPITAL" e "HOSP"', () => {
    expect(inferTipoAtendimento('HOSPITAL DAS CLINICAS')).toBe('Hospital');
    expect(inferTipoAtendimento('HOSP. SAMARITANO')).toBe('Hospital');
  });

  it('reconhece Pronto-Socorro antes de Hospital (ordem importa)', () => {
    expect(inferTipoAtendimento('PRONTO SOCORRO MUNICIPAL')).toBe('Pronto-Socorro');
    expect(inferTipoAtendimento('PS CARDIACO')).toBe('Pronto-Socorro');
  });

  it('reconhece Maternidade antes de Hospital', () => {
    expect(inferTipoAtendimento('MATERNIDADE PRO MATRE')).toBe('Maternidade');
    expect(inferTipoAtendimento('HOSPITAL E MATERNIDADE SAO LUIZ')).toBe('Maternidade');
  });

  it('reconhece Laboratório', () => {
    expect(inferTipoAtendimento('LABORATORIO ALPHA')).toBe('Laboratório');
    expect(inferTipoAtendimento('LAB FLEURY')).toBe('Laboratório');
    expect(inferTipoAtendimento('ANÁLISES CLÍNICAS BIO')).toBe('Laboratório');
    expect(inferTipoAtendimento('PATOLOGIA AVANÇADA')).toBe('Laboratório');
  });

  it('reconhece Diagnóstico por Imagem', () => {
    expect(inferTipoAtendimento('CENTRO DE IMAGEM')).toBe('Diagnóstico por Imagem');
    expect(inferTipoAtendimento('RADIOLOGIA SP')).toBe('Diagnóstico por Imagem');
    expect(inferTipoAtendimento('TOMOGRAFIA AVANCADA')).toBe('Diagnóstico por Imagem');
    expect(inferTipoAtendimento('RESSONANCIA RJ')).toBe('Diagnóstico por Imagem');
    expect(inferTipoAtendimento('ULTRASSOM EXPRESS')).toBe('Diagnóstico por Imagem');
  });

  it('reconhece Odontologia', () => {
    expect(inferTipoAtendimento('CLINICA ODONTOLOGICA')).toBe('Odontologia');
    expect(inferTipoAtendimento('CONSULTORIO DENTÁRIO')).toBe('Odontologia');
    expect(inferTipoAtendimento('ORTODONTIA AVANCADA')).toBe('Odontologia');
  });

  it('reconhece Clínica (após filtros mais específicos)', () => {
    expect(inferTipoAtendimento('CLINICA PEDIATRICA')).toBe('Clínica');
  });

  it('reconhece Centro/Instituto', () => {
    expect(inferTipoAtendimento('INSTITUTO DE OLHOS')).toBe('Centro/Instituto');
    expect(inferTipoAtendimento('CENTRO ONCOLOGICO')).toBe('Centro/Instituto');
    expect(inferTipoAtendimento('FUNDACAO BENEFICENTE')).toBe('Centro/Instituto');
  });

  it('cai em Outro quando nenhum padrão bate', () => {
    expect(inferTipoAtendimento('CONSULTORIO MEDICO DR SILVA')).toBe('Outro');
    expect(inferTipoAtendimento('ESPACO BEM ESTAR')).toBe('Outro');
  });
});

// ─── getAllPrestadores (AC2) ─────────────────────────────────────────────

describe('getAllPrestadores()', () => {
  it('retorna 9325 prestadores (validação contra dataset commitado)', () => {
    const prestadores = getAllPrestadores();
    expect(prestadores).toHaveLength(9325);
  });

  it('cada prestador tem campos enriquecidos (tipoInferido + slug)', () => {
    const prestadores = getAllPrestadores();
    const sample = prestadores[0];
    expect(sample.tipoInferido).toBeDefined();
    expect(sample.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('cache é warmed e idempotente (chamadas múltiplas retornam mesma referência)', () => {
    const first = getAllPrestadores();
    const second = getAllPrestadores();
    expect(first).toBe(second);
  });
});

// ─── getMunicipios (AC2) ─────────────────────────────────────────────────

describe('getMunicipios()', () => {
  it('retorna 438 municípios únicos', () => {
    const municipios = getMunicipios();
    expect(municipios).toHaveLength(438);
  });

  it('ordena desc por totalPrestadores', () => {
    const municipios = getMunicipios();
    for (let i = 0; i < municipios.length - 1; i += 1) {
      expect(municipios[i].totalPrestadores).toBeGreaterThanOrEqual(
        municipios[i + 1].totalPrestadores
      );
    }
  });

  it('cada município tem ufSlug + cidadeSlug bem-formados', () => {
    const municipios = getMunicipios();
    for (const m of municipios.slice(0, 10)) {
      expect(m.ufSlug).toMatch(/^[a-z]{2}$/);
      expect(m.cidadeSlug).toMatch(/^[a-z0-9-]+$/);
      expect(m.totalPrestadores).toBeGreaterThan(0);
    }
  });
});

// ─── getMunicipioBySlug + getPrestadoresPorMunicipio ─────────────────────

describe('getMunicipioBySlug() + getPrestadoresPorMunicipio()', () => {
  it('resolve UF + cidade slug existentes', () => {
    const m = getMunicipioBySlug('df', 'brasilia');
    expect(m).not.toBeNull();
    expect(m?.uf).toBe('DF');
    expect(m?.municipio).toBe('BRASILIA');
  });

  it('retorna null para UF/cidade inválidos', () => {
    expect(getMunicipioBySlug('xx', 'inexistente')).toBeNull();
    expect(getMunicipioBySlug('df', 'cidade-fantasma')).toBeNull();
  });

  it('aceita UF lowercase ou uppercase no parâmetro', () => {
    const lower = getMunicipioBySlug('df', 'brasilia');
    const upper = getMunicipioBySlug('DF', 'brasilia');
    expect(lower).toEqual(upper);
  });

  it('getPrestadoresPorMunicipio() retorna prestadores reais do município', () => {
    const prestadores = getPrestadoresPorMunicipio('df', 'brasilia');
    expect(prestadores.length).toBeGreaterThan(0);
    for (const p of prestadores) {
      expect(p.uf).toBe('DF');
      expect(p.municipio).toBe('BRASILIA');
    }
  });
});

// ─── getPrestadoresPorBairro ─────────────────────────────────────────────

describe('getPrestadoresPorBairro()', () => {
  it('retorna prestadores de um bairro específico', () => {
    const prestadores = getPrestadoresPorBairro('df', 'brasilia', 'taguatinga-norte');
    for (const p of prestadores) {
      expect(slugify(p.bairro)).toBe('taguatinga-norte');
    }
  });

  it('retorna array vazio para bairro inválido', () => {
    expect(getPrestadoresPorBairro('df', 'brasilia', 'bairro-inexistente')).toHaveLength(0);
  });
});

// ─── getMunicipiosByUf + getTopMunicipios ────────────────────────────────

describe('getMunicipiosByUf()', () => {
  it('retorna apenas municípios da UF dada', () => {
    const sp = getMunicipiosByUf('SP');
    for (const m of sp) {
      expect(m.uf).toBe('SP');
    }
  });

  it('aceita UF lowercase', () => {
    const upper = getMunicipiosByUf('SP');
    const lower = getMunicipiosByUf('sp');
    expect(lower).toEqual(upper);
  });

  it('retorna vazio para UF inexistente', () => {
    expect(getMunicipiosByUf('XX')).toHaveLength(0);
  });
});

describe('getTopMunicipios()', () => {
  it('respeita limit', () => {
    expect(getTopMunicipios(5)).toHaveLength(5);
    expect(getTopMunicipios(20)).toHaveLength(20);
  });

  it('ordenado desc por totalPrestadores', () => {
    const top = getTopMunicipios(10);
    for (let i = 0; i < top.length - 1; i += 1) {
      expect(top[i].totalPrestadores).toBeGreaterThanOrEqual(top[i + 1].totalPrestadores);
    }
  });
});

// ─── getBairrosDoMunicipio ───────────────────────────────────────────────

describe('getBairrosDoMunicipio()', () => {
  it('agrega bairros com contagem desc', () => {
    const prestadoresDF = getPrestadoresPorMunicipio('df', 'brasilia');
    const bairros = getBairrosDoMunicipio(prestadoresDF);
    expect(bairros.length).toBeGreaterThan(0);
    for (let i = 0; i < bairros.length - 1; i += 1) {
      expect(bairros[i].total).toBeGreaterThanOrEqual(bairros[i + 1].total);
    }
  });

  it('ignora prestadores sem bairro', () => {
    const fixture: PrestadorAmil[] = [
      { codigo: '1', nome: 'A', uf: 'SP', municipio: 'X', bairro: '', redes: [], tipoInferido: 'Outro', slug: 'a' },
      { codigo: '2', nome: 'B', uf: 'SP', municipio: 'X', bairro: 'Centro', redes: [], tipoInferido: 'Outro', slug: 'b' },
    ];
    const bairros = getBairrosDoMunicipio(fixture);
    expect(bairros).toHaveLength(1);
    expect(bairros[0].bairro).toBe('Centro');
  });

  it('aceita array vazio', () => {
    expect(getBairrosDoMunicipio([])).toHaveLength(0);
  });
});

// ─── getPrestadoresPorRede + getPrestadoresPorTipo (AC2) ─────────────────

describe('getPrestadoresPorRede()', () => {
  it("AMIL S750 QP retorna 4959 prestadores (count exato dataset 2026-04-26)", () => {
    expect(getPrestadoresPorRede('AMIL S750 QP')).toHaveLength(4959);
  });

  it('BLACK retorna 4963 prestadores', () => {
    expect(getPrestadoresPorRede('BLACK')).toHaveLength(4963);
  });

  it('ADESÃO BRONZE SP (cauda) retorna 937 prestadores', () => {
    expect(getPrestadoresPorRede('ADESÃO BRONZE SP')).toHaveLength(937);
  });
});

describe('getPrestadoresPorTipo()', () => {
  it('retorna prestadores do tipo dado', () => {
    const hospitais = getPrestadoresPorTipo('Hospital');
    for (const p of hospitais.slice(0, 10)) {
      expect(p.tipoInferido).toBe('Hospital');
    }
  });

  it('total por tipo + Outro = total geral', () => {
    let sum = 0;
    for (const tipo of ['Hospital', 'Pronto-Socorro', 'Maternidade', 'Clínica', 'Laboratório', 'Diagnóstico por Imagem', 'Centro/Instituto', 'Odontologia', 'Outro'] as const) {
      sum += getPrestadoresPorTipo(tipo).length;
    }
    expect(sum).toBe(9325);
  });
});

// ─── getEstatisticasRede + getEstatisticasByUF (AC2) ─────────────────────

describe('getEstatisticasRede()', () => {
  it('totalUFs === 26', () => {
    expect(getEstatisticasRede().totalUFs).toBe(26);
  });

  it('totalMunicipios === 438', () => {
    expect(getEstatisticasRede().totalMunicipios).toBe(438);
  });

  it('totalPrestadores === 9325', () => {
    expect(getEstatisticasRede().totalPrestadores).toBe(9325);
  });

  it('porRede tem 11 entradas (todas redes ativas)', () => {
    const stats = getEstatisticasRede();
    expect(Object.keys(stats.porRede)).toHaveLength(11);
  });

  it('porUF tem 26 entradas', () => {
    expect(Object.keys(getEstatisticasRede().porUF)).toHaveLength(26);
  });
});

describe('getEstatisticasByUF()', () => {
  it('retorna stats da UF dada', () => {
    const sp = getEstatisticasByUF('SP');
    expect(sp.uf).toBe('SP');
    expect(sp.ufSlug).toBe('sp');
    expect(sp.totalPrestadores).toBeGreaterThan(0);
  });

  it('UF inexistente retorna zeros', () => {
    const xx = getEstatisticasByUF('XX');
    expect(xx.totalPrestadores).toBe(0);
    expect(xx.totalMunicipios).toBe(0);
  });
});

// ─── getPrestadorBySlug + prestadorSlug ──────────────────────────────────

describe('getPrestadorBySlug() + prestadorSlug()', () => {
  it('resolve prestador real do dataset', () => {
    const todos = getAllPrestadores();
    const sample = todos[0];
    const ufSlug = sample.uf.toLowerCase();
    const cidadeSlug = slugify(sample.municipio);

    const resolved = getPrestadorBySlug(ufSlug, cidadeSlug, sample.slug);
    expect(resolved).not.toBeNull();
    expect(resolved?.codigo).toBe(sample.codigo);
  });

  it('retorna null para slug inexistente', () => {
    expect(getPrestadorBySlug('df', 'brasilia', 'prestador-fantasma-xyz')).toBeNull();
  });

  it('prestadorSlug() retorna o campo slug', () => {
    const sample = getAllPrestadores()[0];
    expect(prestadorSlug(sample)).toBe(sample.slug);
  });
});

// ─── getDatasetMetadata ──────────────────────────────────────────────────

describe('getDatasetMetadata()', () => {
  it('expõe geradoEm + fonte + totals do header', () => {
    const meta = getDatasetMetadata();
    expect(meta.geradoEm).toBe('2026-04-26T02:21:13.770Z');
    expect(meta.fonte).toBe('powerbi-amil-public');
    expect(meta.totalPrestadores).toBe(9325);
    expect(meta.totalRedes).toBe(49);
  });
});
