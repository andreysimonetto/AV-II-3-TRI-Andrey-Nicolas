CREATE TABLE publicacoes (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descricao VARCHAR(300),
  conteudo TEXT NOT NULL,
  data_publicacao DATE DEFAULT CURRENT_DATE
);
