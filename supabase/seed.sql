-- G-TECH SUMMIT 2026 — import of the content currently published on the site.
-- Generated from src/config/partners.ts, src/content/faq.ts, src/content/programme.ts
-- and src/config/settings.ts. Run once, after 0001_init.sql.
-- Everything is imported as published, exactly as it is online today.

begin;

insert into public.event_settings (id, registration_open, team_size_min, team_size_max) values (1, false, 5, 5);

insert into public.partners (name, logo_path, logo_width, logo_height, position, published) values
  ('AfroLink', '/partners/afrolink.png', 640, 94, 1, true),
  ('AIESEC', '/partners/aiesec.png', 640, 91, 2, true),
  ('H-Electro', '/partners/h-electro.png', 488, 488, 3, true),
  ('Neddigi', '/partners/neddigi.png', 640, 348, 4, true),
  ('DigiFemmes Côte d’Ivoire', '/partners/digifemmes-ci.png', 640, 183, 5, true),
  ('FIRATEK', '/partners/firatek.png', 389, 227, 6, true),
  ('IT-LeadHER', '/partners/it-leadher.png', 640, 607, 7, true),
  ('Les Gos Créatives', '/partners/les-gos-creatives.png', 640, 640, 8, true),
  ('REDIS-IUA', '/partners/redis-iua.png', 640, 622, 9, true);

insert into public.faq_items (question, answer, position, published) values
  ('Faut-il avoir un niveau technique pour venir ?', 'Non. G-TECH SUMMIT s’adresse aussi bien aux personnes qui découvrent la tech qu’aux professionnels. Les formations express sont accessibles aux débutants comme aux initiés, et l’initiation au développement web ne demande aucun prérequis.', 1, true),
  ('Quels sont les différents pass ?', 'Le Pass En ligne (5 000 FCFA, 100 places) permet de suivre les deux jours à distance : le lien de connexion est envoyé par e-mail. Le Pass Présentiel (10 000 FCFA, 40 places) donne accès sur place aux deux jours : conférences, panels, formations express, ateliers, stands et networking. Le Pass Hackathon (15 000 FCFA par équipe de 5 personnes, 10 équipes) donne accès au hackathon et, pour chaque membre de l’équipe, à l’événement sur place.', 2, true),
  ('Je veux participer à l’événement et au hackathon. Comment faire ?', 'Prenez le Pass Hackathon : il donne à chaque membre de l’équipe l’accès à l’événement sur place, en plus du hackathon. Les pass ne se cumulent pas : une inscription correspond à un seul pass.', 3, true),
  ('Comment se passe le paiement ?', 'Le paiement se fera en ligne via Wave, directement depuis le site. Aucun frais supplémentaire n’est ajouté au prix affiché. Les inscriptions en ligne ouvrent prochainement.', 4, true),
  ('Comment vais-je recevoir mon billet ?', 'Par e-mail, une fois le paiement réellement confirmé. Le billet est nominatif et contient un QR code unique, scanné à l’entrée.', 5, true),
  ('Peut-on participer seul au hackathon ?', 'Non, la participation se fait en équipe uniquement, de 5 personnes. Un seul Pass Hackathon est pris pour toute l’équipe, et 10 équipes au maximum peuvent s’inscrire.', 6, true),
  ('Comment s’inscrire aux formations express ?', 'Sur place, le samedi 19 décembre. Les places sont limitées (25 à 30 participants par module). Chaque formation donne lieu à une attestation de participation.', 7, true),
  ('Où se déroule l’événement ?', 'À Abidjan. Le lieu exact sera annoncé prochainement sur ce site.', 8, true),
  ('Peut-on annuler ou se faire rembourser ?', 'La politique d’annulation est en cours de définition. Elle sera publiée avant l’ouverture des inscriptions.', 9, true);

insert into public.programme_slots (day, start_time, end_time, type, title, subtitle, detail, room, ref, position, published) values
  (1, '08:00', null, 'accueil', 'Accueil, enregistrement & visite des stands partenaires', null, null, 'Hall d’entrée', null, 1, true),
  (1, '09:00', null, 'ouverture', 'Cérémonie d’ouverture officielle', null, 'Mot de bienvenue de Ghostech', 'Salle principale', null, 2, true),
  (1, '09:45', null, 'conference', 'Conférence 1', 'Intelligence artificielle & avenir du travail', '45 min + questions', 'Salle principale', 'conference-1', 3, true),
  (1, '11:00', null, 'conference', 'Conférence 2', 'Entrepreneuriat tech en Afrique', '45 min + questions', 'Salle principale', 'conference-2', 4, true),
  (1, '12:30', null, 'pause', 'Pause déjeuner & networking libre', null, 'Visite des stands startups', 'Hall / Stands', null, 5, true),
  (1, '14:00', '15:30', 'atelier', 'Ateliers pratiques — session 1', null, '3 ateliers en parallèle : A, B, C', 'Salles A · B · C', 'ateliers', 6, true),
  (1, '15:30', null, 'quiz', 'Démonstrations live & quiz tech interactif', null, 'Lots à gagner', 'Salle principale', null, 7, true),
  (1, '16:30', null, 'panel', 'Panel 1', 'Diversité & inclusion dans la tech', null, 'Salle principale', 'panel-1', 8, true),
  (1, '17:30', null, 'networking', 'Clôture du jour 1 & cocktail networking', null, null, 'Hall', null, 9, true),
  (2, '08:00', null, 'accueil', 'Accueil & récap de la première journée', null, null, 'Hall d’entrée', null, 1, true),
  (2, '09:15', '12:15', 'formation', 'Formations express', null, '4 modules en parallèle — attestation de participation', 'Salles A · B · C · D', 'formations', 2, true),
  (2, '11:30', null, 'pause', 'Pause déjeuner & visite des stands', null, 'Networking exposants', 'Hall / Stands', null, 3, true),
  (2, '12:00', null, 'panel', 'Panel 2', 'Cybersécurité & Données : enjeux et bonnes pratiques', null, 'Salle principale', 'panel-2', 4, true),
  (2, '12:45', '14:00', 'atelier', 'Ateliers pratiques — session 2', null, '3 ateliers + nouvelles démonstrations live', 'Salles A · B · C', 'ateliers', 5, true),
  (2, '14:00', null, 'conference', 'Conférence 3', 'Innovation numérique en Côte d’Ivoire : bilan & perspectives', '45 min + questions', 'Salle principale', 'conference-3', 6, true),
  (2, '15:00', null, 'pitch', 'Pitch & présentations finales du hackathon', null, 'Projets finalistes + vote du public', 'Salle principale', null, 7, true),
  (2, '17:00', null, 'cloture', 'Annonce des vainqueurs & remise des prix', null, null, 'Salle principale', null, 8, true),
  (2, '17:30', null, 'networking', 'After-party & cocktail de clôture', null, null, 'Hall principal', null, 9, true);

commit;
