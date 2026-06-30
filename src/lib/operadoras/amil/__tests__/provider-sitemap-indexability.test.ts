import { describe, expect, it } from 'vitest';
import { GET as getProviderSitemap } from '../../../../../app/sitemap-prestadores.xml/route';
import {
  getAllPrestadores,
  getPrestadoresPorMunicipio,
  slugify,
} from '../rede-credenciada-loader';
import { MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL } from '../chunked-static-params';

function locCount(xml: string): number {
  return (xml.match(/<loc>/g) ?? []).length;
}

describe('sitemap-prestadores.xml indexability filter', () => {
  it('lists only provider URLs from cities that meet the indexation threshold', async () => {
    const response = getProviderSitemap();
    const xml = await response.text();

    const expectedIndexable = getAllPrestadores().filter((p) => {
      const totalNoMunicipio = getPrestadoresPorMunicipio(
        p.uf.toLowerCase(),
        slugify(p.municipio),
      ).length;

      return totalNoMunicipio >= MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL;
    });

    const excludedThinProviders = getAllPrestadores().length - expectedIndexable.length;

    expect(locCount(xml)).toBe(expectedIndexable.length);
    expect(excludedThinProviders).toBeGreaterThan(0);
    expect(xml).not.toContain('/rede/rr/');
  });
});