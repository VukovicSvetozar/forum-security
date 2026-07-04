# Internet Forum — Sigurnost na internetu

Web aplikacija realizovana kao siguran internet forum na kojem registrovani korisnici mogu razmjenjivati mišljenja po pitanju različitih tema.

---

## Sadržaj

- [Tehnologije](#tehnologije)
- [Arhitektura sistema](#arhitektura-sistema)
- [Korisničke grupe i permisije](#korisničke-grupe-i-permisije)
- [Sigurnosni mehanizmi](#sigurnosni-mehanizmi)
- [Pokretanje aplikacije](#pokretanje-aplikacije)
- [Screenshotovi](#screenshotovi)

---

## Tehnologije

| Dio | Tehnologija |
|-----|-------------|
| Backend | Java 17, Spring Boot 3, Spring Security |
| Frontend | Angular 17, TypeScript |
| Baza podataka | MySQL 8 |
| Cache / Blacklisting | Redis |
| Autentikacija | JWT (JJWT), OAuth2 (GitHub) |
| SSL/TLS | Java Keystore (JKS) |
| Email | JavaMail (Gmail SMTP) |
| Logovanje | Logback (rolling file) + custom JSON log |

---

## Arhitektura sistema

Sistem je organizovan prema zadatoj arhitekturi koja uključuje sljedeće komponente:

- **Access Controller** — prima sve korisničke zahtjeve i prosljeđuje ih odgovarajućim servisima
- **Authentication Controller** — vrši autentikaciju korisnika i autorizaciju zahtjeva
- **JWT Controller** — izdaje, validira i poništava JWT tokene (Redis blacklista)
- **WAF (Web Application Firewall)** — skenira svaki zahtjev, blokira SQL injection, XSS, buffer overflow i DDoS napade; automatski zatvara sesiju nakon ponovljenih malicioznih zahtjeva
- **Certificate Controller** — HTTPS/TLS zaštita komunikacije pomoću JKS keystora
- **SIEM** — praćenje i logovanje svih sigurnosno osjetljivih zahtjeva (WAF detekcije, JWT greške, neuspješne prijave)

---

## Korisničke grupe i permisije

Sistem podržava četiri statusa korisnika i tri aktivne grupe:

| Grupa | Opis |
|-------|------|
| `GUEST` | Korisnik koji čeka na odobrenje administratora |
| `MEMBER` | Registrovani forumaš — može čitati i pisati komentare |
| `MODERATOR` | Može uređivati i brisati komentare svih korisnika |
| `ADMIN` | Puni pristup — upravljanje korisnicima, temama i monitoringom |

Svaki korisnik ima individualno podešen skup permisija koji administrator može mijenjati nezavisno od grupe:

`ADMIN_MANAGE_ACCESS` · `ADMIN_CHANGE_GROUP` · `ADMIN_MODIFY_PERMISSIONS` · `ADMIN_SUSPEND_USER` · `ADMIN_DEACTIVATE_USER` · `ADMIN_TOPIC` · `MODERATOR_UPDATE_COMMENT` · `MODERATOR_DELETE_COMMENT` · `MEMBER_CREATE_COMMENT` · `MEMBER_UPDATE_COMMENT` · `MEMBER_DELETE_COMMENT`

---

## Sigurnosni mehanizmi

### Dvo-faktorska autentikacija (2FA)

Prijava je realizovana u dva koraka:
1. Korisnik unosi korisničko ime i lozinku → sistem šalje šestocifreni verifikacioni kod na email
2. Korisnik unosi kod (validan 3 minute) → sistem izdaje JWT access i refresh token

### JWT tokeni

Sistem koristi tri vrste tokena sa različitim vremenima trajanja:

| Token | Trajanje |
|-------|----------|
| Login token (privremeni) | 3 minute |
| Access token | 1 sat |
| Refresh token | 3 dana |

Poništeni tokeni se čuvaju u Redis blacklisti.

### WAF filter

WAF skenira svaki HTTP zahtjev (header, parametre i tijelo) i blokira:

- **SQL Injection** — regex detekcija SQL ključnih riječi
- **XSS** — detekcija skript tagova i event handlera
- **Buffer Overflow** — odbijanje zahtjeva većih od 1 MB
- **DDoS / Rate Limiting** — maksimalno 300 zahtjeva po 60 sekundi po IP adresi

Nakon 5 detektovanih malicioznih zahtjeva od istog korisnika, JWT token se automatski dodaje na blacklistu.

### OAuth2 prijava

Pored standardne prijave, podržana je prijava putem GitHub naloga. Novi OAuth2 korisnici prolaze kroz isti proces odobrenja od strane administratora i 2FA verifikaciju.

### HTTPS / SSL

Cijela komunikacija između klijenta i servera je zaštićena TLS-om. Server radi na portu `8443`, Angular klijent na portu `4200` — oba sa SSL sertifikatima.

### Content Security Policy

Backend postavlja CSP headere koji ograničavaju izvore skripti, stilova, fontova i konekcija:

```
default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com; ...
```

### SIEM logovanje

Sistem loguje sve sigurnosno osjetljive događaje na dva načina:
- **logback rolling file** (`log/logData.log`) — standardni aplikativni logovi, max 3 MB po fajlu, čuva se 10 rotacija
- **JSON error log** (`log/logError.json`) — strukturirani log WAF detekcija i JWT grešaka, dostupan adminu kroz monitoring panel

---

## Pokretanje aplikacije

### Preduslovi

- Java 17+
- Node.js 18+
- MySQL 8
- Redis

### Backend

```bash
cd Server/forum
```

Uvezi bazu podataka:
```bash
mysql -u root -p < ../../Baza/internetForum.sql
```

Pokreni Spring Boot server:
```bash
./mvnw spring-boot:run
```

Server se pokreće na `https://localhost:8443`.

### Frontend

```bash
cd Klijent/forum
npm install
ng serve --ssl
```

Aplikacija je dostupna na `https://localhost:4200`.

---

## Screenshotovi

### Početna stranica

<div align="center">
  <img src="Slike/1.png" width="500" alt="Početna stranica">&nbsp;
</div>

---

### Prijava — standardna i GitHub OAuth2

<div align="center">
  <img src="Slike/2.png" width="400" alt="Prijava">&nbsp;
</div>

---

### Dvo-faktorska autentikacija — unos verifikacionog koda

<div align="center">
  <img src="Slike/3.png" width="400" alt="2FA verifikacija">&nbsp;
</div>

Validacija unosa — kod mora biti šestocifreni broj:

<div align="center">
  <img src="Slike/4.png" width="400" alt="2FA validacija">&nbsp;
</div>

---

### Registracija sa validacijom

<div align="center">
  <img src="Slike/5.png" width="400" alt="Registracija">&nbsp;
</div>

---

### Forum — lista tema

<div align="center">
  <img src="Slike/6.png" width="550" alt="Forum teme">&nbsp;
</div>

---

### Forum — komentari po temi

<div align="center">
  <img src="Slike/7.png" width="550" alt="Komentari">&nbsp;
</div>

---

### Lista članova

<div align="center">
  <img src="Slike/8.png" width="550" alt="Lista članova">&nbsp;
</div>

---

### Administratorski panel — upravljanje korisnicima

<div align="center">
  <img src="Slike/9.png" width="550" alt="Admin korisnici">&nbsp;
</div>

---


### Promjena permisija korisnika

<div align="center">
  <img src="Slike/10.png" width="550" alt="Promjena permisija">&nbsp;
</div>

---

### Suspenzija korisnika

<div align="center">
  <img src="Slike/11.png" width="550" alt="Suspenzija">&nbsp;
</div>

---

### Upravljanje temama

<div align="center">
  <img src="Slike/12.png" width="550" alt="Admin teme">&nbsp;
</div>

---

### Monitoring — SIEM log grešaka

<div align="center">
  <img src="Slike/13.png" width="550" alt="SIEM greške">&nbsp;
</div>

---

### Monitoring — detalj greške (WAF detekcija SQL Injection napada)

<div align="center">
  <img src="Slike/14.png" width="550" alt="Detalj greške">&nbsp;
</div>

---

### Monitoring — aplikativni logovi sa filtriranjem

<div align="center">
  <img src="Slike/15.png" width="550" alt="Logovi">&nbsp;
</div>

---

### Korisnički profil — ažuriranje podataka

<div align="center">
  <img src="Slike/16.png" width="550" alt="Profil">&nbsp;
</div>

---

### Odabir avatara

<div align="center">
  <img src="Slike/17.png" width="550" alt="Avatar">&nbsp;
</div>

---
