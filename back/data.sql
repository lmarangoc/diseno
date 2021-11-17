-- mysql -h database-1.cmlwdskqtfdl.us-east-2.rds.amazonaws.com -P 3306 -u admin -p

CREATE TABLE Locations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    rpm DECIMAL(6,2),
    fecha BIGINT,
    conductor BIGINT
);
