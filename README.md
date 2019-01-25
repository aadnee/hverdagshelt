# Hverdagshelt Scrum 8


## Krav
1. En MySql server versjon 8 eller lavere (Eller 8 og høyere med mysql_native_password)
2. MySql innloggingsdetaljer og en tom Database

## Installasjon
1. Last ned eller klon prosjektet lokalt
2. Lag en '.env' fil ('.env.' på Windows) med følgende detailer fylt inn
```TEXT
JWT=EN_TILFELDIG_STRENG
MYSQL_DB=DITT_MYSQL_DATABASENAVN
MYSQL_USR=DITT_MYSQL_BRUKERNAVN
MYSQL_PWD=DITT_MYSQL_PASSORD
MYSQL_HOST=DIN_MYSQL_TJENER
```
3. Legg '.env' filen i /server mappen.
4. Gå til / og kjør følgende kode for å kjøre automatisk installasjon:
```sh
cd server
npm run hverdagshelt
```
5. Naviger til http://localhost:3000/
6. Logg inn med følgende detaljer:
```TEXT
Epost: admin@admin.com
Passord: 123
```
7. Hverdagshelt er nå satt opp og klart til bruk
