export default [
  { section: 'Especial', name: 'Mascote' },
  { section: 'Especial', name: 'Panini' },
  { section: 'Especial', name: 'Kremlin' },
  { section: 'Especial', name: 'Batta das Figurinhas' },
  { section: 'Estádios', name: 'Palestra Itália' },
  { section: 'Estádios', name: 'Arena Corinthians' },
  { section: 'Estádios', name: 'Maracanã' },
  { section: 'Estádios', name: 'Pacaembú' },
  { section: 'Estádios', name: 'São Januário' },
  { section: 'Brasil', name: 'Alisson' },
  { section: 'Brasil', name: 'Daniel Alves' },
  { section: 'Brasil', name: 'Marquinhos' },
  { section: 'Brasil', name: 'Miranda' },
  { section: 'Brasil', name: 'Marcelo' },
  { section: 'Brasil', name: 'Renato Augusto' },
  { section: 'Brasil', name: 'Casemiro' },
  { section: 'Brasil', name: 'Paulinho' },
  { section: 'Brasil', name: 'Coutinho' },
  { section: 'Brasil', name: 'Gabriel Jesus' },
  { section: 'Brasil', name: 'Neymar' },
  { section: 'Argentina', name: 'Romero' },
  { section: 'Argentina', name: 'Mercado' },
  { section: 'Argentina', name: 'Otamedi' },
  { section: 'Argentina', name: 'Mascherano' },
  { section: 'Argentina', name: 'Acuña' },
  { section: 'Argentina', name: 'Biglia' },
  { section: 'Argentina', name: 'Banega' },
  { section: 'Argentina', name: 'Messi' },
  { section: 'Argentina', name: 'Dybala' },
  { section: 'Argentina', name: 'Di Maria' },
  { section: 'Argentina', name: 'Aguero' },
].map((sticker, index) => ({ ...sticker, count: 0, stickerNumber: index + 1 }));
