-- Utilisateur MySQL de l'API : seulement les droits dont elle a besoin
-- À exécuter en root dans la console d'IntelliJ
-- Ne jamais écrire le vrai mot de passe dans ce fichier

CREATE USER IF NOT EXISTS 'neurao_app'@'%' IDENTIFIED BY 'MOT_DE_PASSE';
ALTER USER 'neurao_app'@'%' IDENTIFIED BY 'MOT_DE_PASSE';
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'neurao_app'@'%';
GRANT SELECT, INSERT, UPDATE ON neurao.* TO 'neurao_app'@'%';
