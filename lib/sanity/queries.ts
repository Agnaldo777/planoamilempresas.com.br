// GROQ queries for Sanity CMS

export const ALL_PLANOS_QUERY = `*[_type == "plano"] | order(preco_base asc) {
  _id, nome, slug, linha, tipo, cobertura, coparticipacao,
  reembolso, telemedicina, features, preco_base,
  meta_title, meta_description
}`;

export const PLANO_BY_SLUG_QUERY = `*[_type == "plano" && slug.current == $slug][0] {
  _id, nome, slug, linha, tipo, cobertura, coparticipacao,
  reembolso, telemedicina, features, hospitais_destaque,
  preco_base, conteudo, meta_title, meta_description,
  "faqs": faqs[]->{ pergunta, resposta }
}`;

export const ALL_CIDADES_QUERY = `*[_type == "cidade"] | order(populacao desc) {
  _id, nome, slug, estado, uf, populacao,
  tem_espaco_saude, meta_title, meta_description
}`;

export const CIDADE_BY_SLUG_QUERY = `*[_type == "cidade" && slug.current == $slug][0] {
  _id, nome, slug, estado, uf, populacao,
  hospitais_amil, tem_espaco_saude, espaco_saude_endereco,
  "planos_disponiveis": planos_disponiveis[]->{ nome, slug, preco_base },
  conteudo_local, meta_title, meta_description
}`;

export const ALL_BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(published_at desc) {
  _id, titulo, slug, categoria, excerpt,
  imagem_destaque, published_at, meta_title, meta_description
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, titulo, slug, categoria, conteudo, excerpt,
  imagem_destaque, published_at, meta_title, meta_description,
  "faqs": faqs[]->{ pergunta, resposta }
}`;

export const ALL_FAQS_QUERY = `*[_type == "faq"] | order(categoria asc) {
  _id, pergunta, resposta, categoria, slug
}`;
