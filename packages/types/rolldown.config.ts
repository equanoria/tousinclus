import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts', // Fichier d'entrée principal
  output: {
    dir: 'dist', // Répertoire de sortie
    format: 'esm', // Format ESM pour Node
    preserveModules: true, // Conserve la structure des dossiers
  },
  treeshake: true, // Pour enlever le code JS inutilisé
  external: [], // Ajoutez ici les dépendances externes (ex: ['react']) si nécessaire
});
