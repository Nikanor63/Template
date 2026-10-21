# Cours : créer et personnaliser un CV

Ce dossier contient le moteur commun aux catégories. Les dossiers `cv-*`
contiennent les réglages et les fonctions spécialisées de chaque style. Suis le
parcours ci-dessous pour comprendre la fabrication d'un modèle.

## 1. Comprendre les données

Ouvre `types.ts` : `CvContent` décrit les informations d'une personne,
`CvElement` décrit les objets dessinables, et `CvTemplate` décrit un modèle de
la galerie. Un CV est une page composée d'un tableau d'éléments : chaque texte,
image, ligne ou forme a une position et une taille.

Ouvre ensuite `sample.ts`. Pour modifier le contenu de démonstration des CV
généraux, change `SAMPLE_CONTENT`. Les modèles Étudiant utilisent leurs propres
données dans `cv-Étudiant/Etudiant.ts`. Cela permet de tester plusieurs styles
avec le même contenu sans recopier les mêmes coordonnées.

## 2. Choisir une catégorie et son style

Chaque dossier de catégorie contient un fichier de configuration, par exemple
`cv-Professionnel/Professionnel.ts`. Il donne les polices, les noms des modèles,
les tags et les palettes. `category-config.ts` explique les propriétés requises
et `F` répertorie les polices disponibles.

Une palette fournit au minimum `primary` et `secondary`. Le moteur utilise
`primary` pour les accents et `secondary` pour les fonds secondaires. Tu peux
facultativement ajouter `text` et `bg` pour fixer le texte et le fond de page.
`color.ts` aide à mélanger les couleurs et à choisir un texte lisible dessus.

## 3. Dessiner avec le builder

`builder.ts` fournit les briques :

- `makeText` crée un texte ; indique son contenu, x/y, sa largeur et son style.
- `makeRect`, `makeCircle` et `makeLine` créent les formes.
- `makeImage` place un portrait ; son `src` doit être un chemin disponible dans
  `public` ou une URL d'image.
- `createColumn` (plus bas dans le fichier) empile titres, paragraphes,
  expériences, formations et listes.

La page mesure 794 × 1123 unités, comme indiqué par `PAGE_WIDTH` et
`PAGE_HEIGHT` dans `types.ts`. Le point `(0, 0)` est en haut à gauche. Augmenter
x déplace vers la droite ; augmenter y déplace vers le bas. Les valeurs w et h
sont la largeur et la hauteur.

Exemple de texte dans une fonction de layout :

```ts
makeText({
  text: content.fullName,
  x: 50,
  y: 60,
  w: 400,
  fontSize: 34,
  fontWeight: 700,
  color: style.text,
})
```

Quand tu utilises `createColumn`, le placement vertical est automatique :

```ts
const main = createColumn(elements, style, 50, 60, 694, colors)
main.heading('Profil').para(content.summary)
main.gap(12).heading('Expérience').experiences(content.experiences)
```

Les méthodes peuvent être chaînées. `gap(12)` ajoute de l'espace vertical entre
les blocs. `heading` crée un titre, `para` crée un texte, et `experiences` rend
les éléments d'expérience fournis dans `CvContent`.

## 4. Faire et importer un dégradé déplaçable

Un dégradé CSS est une valeur de remplissage, pas un objet séparé. Dans ce
générateur, on le met dans `fill` d'un rectangle. Le rectangle reste alors un
élément normal : on peut le sélectionner, le déplacer, le redimensionner, le
faire tourner, le dupliquer, le supprimer et l'annuler. Il passe par les mêmes
fonctions de sélection que les carrés.

Dans l'éditeur, clique sur l'icône de dégradé. Un rectangle bleu-rose est ajouté
et sélectionné. Dans le panneau Style, colle ou modifie une valeur dans
« Remplissage CSS ». Exemples :

```css
linear-gradient(135deg, #5CAFE7 0%, #FF679D 100%)
linear-gradient(to right, #123B5A, #5CAFE7, #FFFFFF)
radial-gradient(circle, #FFE361 0%, #FF679D 75%)
```

Cette valeur est enregistrée dans le champ `fill` du rectangle et sauvegardée
avec le CV. Pour importer un dégradé venant d'un autre outil, copie sa valeur
CSS et colle-la dans ce champ. Si tu importes plutôt une image PNG/JPG/SVG, le
bouton d'import d'image la place comme image ; elle sera également déplaçable,
mais ses couleurs ne seront plus modifiables comme un dégradé CSS.

Pour mettre un dégradé directement dans un modèle écrit en code, donne la même
valeur à `fill` quand tu appelles `makeRect` :

```ts
makeRect({
  x: 40,
  y: 40,
  w: 300,
  h: 100,
  fill: 'linear-gradient(135deg, #123B5A, #5CAFE7)',
  name: 'Bandeau dégradé',
})
```

Comme c'est un rectangle unique, le déplacement garde le dégradé attaché à sa
forme. Pour déplacer le dégradé indépendamment de son rectangle, crée un second
rectangle avec le dégradé voulu.

## 5. Créer une variante de layout

Dans `builder.ts`, une fonction de layout reçoit un style et un contenu, puis
renvoie `{ background, elements }`. Pour expérimenter, copie un layout existant,
change la position des colonnes et des éléments, puis ajoute ta fonction au
tableau `LAYOUTS` avec une clé stable et un label lisible :

```ts
{ key: 'mon-layout', label: 'Mon layout', fn: monLayout }
```

Les catégories générales réutilisent cette liste. Minimaliste possède sa liste
particulière dans `cv-Minimaliste/minimaliste-layouts.ts`, ce qui montre comment
une catégorie peut dessiner ses layouts séparément.

## 6. Créer un CV de démonstration personnel

Pour simplement afficher ton propre contenu dans les modèles, remplace les
valeurs de `SAMPLE_CONTENT`. Si tu veux garder l'exemple original, crée un objet
`CvContent` distinct dans le fichier de ta catégorie et utilise-le comme base
dans `cv-shared/templates.ts`.

Pour ajouter un nouveau modèle à une catégorie existante :

1. Ajoute un nom dans le tableau `names` de sa configuration.
2. Ajoute une palette à `palettes` à la même position si ce modèle doit avoir
   des couleurs spécifiques.
3. Si tu veux une mise en page différente, ajoute le layout dans son fichier
   `builder.ts` et dans la liste de layouts de la catégorie.
4. Vérifie si le nouveau layout accepte une photo dans `withTemplatePhoto` de
   `templates.ts`.

## 7. Ajouter une catégorie complète

Une catégorie doit être connue à plusieurs endroits pour que le typage,
l'affichage, le layout et les portraits restent cohérents :

1. Ajoute son nom à `TemplateCategory` dans `types.ts`.
2. Crée un dossier `cv-Nom` avec son fichier de configuration, `template.ts`,
   `builder.ts` et `thumbnails.ts`.
3. Inscris ses imports et sa configuration dans `CONFIG` et `CATEGORY_MODULES`
   dans `templates.ts` ; ajoute-la aussi à `CATEGORIES`.
4. Ajoute sa règle dans `INCLUDE_ALL_IMAGES` dans `thumbnails.ts`.
5. Place les portraits dans `public/Nom` et les miniatures dans le même dossier,
   en utilisant les slugs produits par `templates.ts`.

## 8. Icônes, miniatures et vérification

`icons.ts` fait le lien entre les noms d'icônes dans les layouts et Lucide.
`thumbnails.ts` associe les images de `public` aux modèles. Une miniature porte
le slug du modèle, par exemple `moderne-01.png`.

Après une modification du code, lance `npx tsc --noEmit` depuis le dossier du
projet pour vérifier les types. Si une catégorie ne s'affiche pas, vérifie
d'abord ses trois entrées dans `templates.ts`, puis la présence de ses modules
et de son nom dans `TemplateCategory`.
